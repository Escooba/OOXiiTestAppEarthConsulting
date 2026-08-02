import React, { useState, useMemo, useEffect } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { Search, RotateCw, ChevronRight, Edit3, MapPin } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import { useClients } from '../../data/hooks';
import { useData } from '../../data/DataProvider';
import { useAuthContext } from '../lib/AuthProvider';

export interface ClientRecord {
  localId?: string;
  clientId: string;
  testerName: string;
  gender: string;
  yearOfBirth: number;
  cataractSurgery: string;
  region: string;
  latestSessionId: string;
}

// ============================================================================
// FIND A CLIENT
// ============================================================================
export function FindClient({
  onBack, onOpenProfile,
}: {
  onBack: () => void;
  onOpenProfile: (c: ClientRecord) => void;
}) {
  const { t } = useTheme();
  const { tester } = useAuthContext();
  const [query, setQuery] = useState('');
  const { clients, refresh } = useClients();

  const mappedClients = useMemo(() => clients.map(c => ({
    localId: c.localId,
    clientId: c.ooxiiClientId,
    testerName: tester ? `${tester.firstName} ${tester.lastName}`.trim() : 'Community Tester',
    gender: c.gender,
    yearOfBirth: c.yearOfBirth,
    cataractSurgery: c.cataractSurgery,
    region: [c.city, c.stateProvince, c.country].filter(Boolean).join(', ') || 'N/A',
    latestSessionId: `Client #${c.ooxiiClientId}`,
  })), [clients, tester]);

  const filtered = useMemo(() => {
    if (!query) return mappedClients;
    const q = query.toLowerCase();
    return mappedClients.filter((c) =>
      [c.clientId, c.testerName, String(c.yearOfBirth), c.gender, c.cataractSurgery, c.region]
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [query, mappedClients]);

  return (
    <Shell showProgress={false}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-4">
        <Breadcrumb path={[t('ui.home'), t('clients.find_title')]} />
        <h1 className="text-2xl font-light">{t('clients.find_title')}</h1>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 bg-[#140047] rounded-2xl px-4 py-3 border border-white/15 text-white">
            <Search size={18} className="text-[#3BE0D4]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('clients.search_placeholder')}
              className="flex-1 bg-transparent outline-none text-sm placeholder-white/50 text-white"
            />
          </div>
          <button
            type="button"
            aria-label="Refresh client list"
            onClick={refresh}
            className="w-12 h-12 rounded-2xl bg-[#140047] border border-white/15 flex items-center justify-center text-[#3BE0D4] hover:border-[#3BE0D4]/60 transition-colors"
          >
            <RotateCw size={18} />
          </button>
        </div>

        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
          {t('clients.count', { count: filtered.length })}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((c) => (
            <button
              key={c.clientId}
              type="button"
              onClick={() => onOpenProfile(c)}
              className="text-left bg-[#140047]/90 border border-white/10 rounded-2xl p-4 hover:border-[#3BE0D4]/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-[var(--text-muted)]">{t('clients.tester_label', { name: c.testerName })}</div>
                  <div className="text-lg font-medium text-white mt-0.5">{t('clients.client_id', { id: c.clientId })}</div>
                </div>
                <ChevronRight size={18} className="text-[#3BE0D4]" />
              </div>
              <div className="text-sm text-white/80 mt-2">{c.gender}, {c.yearOfBirth}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{t('clients.cataract_surgery', { status: c.cataractSurgery })}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                <MapPin size={11} className="text-[#3BE0D4]" /> {c.region}
              </div>
            </button>
          ))}
        </div>
      </div>
      <BottomBar onBack={onBack} nextLabel={t('home.new_client_title')} onNext={() => onBack()} backLabel={t('ui.home')} />
    </Shell>
  );
}

// ============================================================================
// CLIENT PROFILE
// ============================================================================
export function ClientProfileScreen({
  client, onBack, onOpenVisionReview, onOpenPrescription,
}: {
  client: ClientRecord;
  onBack: () => void;
  onOpenVisionReview: () => void;
  onOpenPrescription: () => void;
}) {
  const { sessionRepo } = useData();
  const [sessionData, setSessionData] = useState<{ session: any; payload: Record<string, any> } | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (sessionRepo && client.localId) {
      sessionRepo.getLatestSessionPayloadForClient(client.localId).then(res => {
        if (isMounted) setSessionData(res);
      });
    }
    return () => { isMounted = false; };
  }, [sessionRepo, client.localId]);

  const displayNum = sessionData?.session?.displayTestNumber
    ? `Test #${sessionData.session.displayTestNumber}`
    : `Client #${client.clientId}`;

  const createdStr = sessionData?.session?.createdAt
    ? new Date(sessionData.session.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  const completedStr = sessionData?.session?.completedAt
    ? new Date(sessionData.session.completedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : (sessionData?.session?.status ? `Status: ${sessionData.session.status}` : 'In progress');

  return (
    <Shell showProgress={false}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-4">
        <Breadcrumb path={['Home', 'Clients', 'Profile']} />
        <h1 className="text-2xl font-light">Client profile</h1>

        <div className="bg-[#22193B] border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#9B93BA] uppercase tracking-wider">Tester : {client.testerName}</div>
            <button type="button" className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#A984FF]/15 border border-[#A984FF]/40 text-[#A984FF] text-xs font-semibold">
              <Edit3 size={12} /> Edit
            </button>
          </div>

          <div>
            <div className="text-xs uppercase text-[#A984FF] tracking-wider font-semibold mb-2">Personal information</div>
            <dl className="text-sm flex flex-col gap-1.5">
              <Row label="Client ID" value={client.clientId} />
              <Row label="Gender" value={client.gender} />
              <Row label="Year of birth" value={String(client.yearOfBirth)} />
              <Row label="Cataract surgery" value={client.cataractSurgery} />
              <Row label="Region" value={client.region} />
            </dl>
          </div>
        </div>

        <h2 className="text-sm uppercase tracking-wider text-[#A984FF] font-semibold mt-2">Test sessions</h2>

        <div className="bg-[#22193B] border border-white/10 rounded-3xl p-5 flex flex-col gap-3">
          <div className="text-lg font-medium">{displayNum}</div>
          <div className="text-xs text-[#9B93BA] flex flex-col gap-1">
            <span>Created: {createdStr}</span>
            <span>Completed: {completedStr}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={onOpenVisionReview} className="flex-1 h-11 rounded-xl bg-[#A984FF] text-[#2A0730] font-semibold text-sm">
              Vision testing
            </button>
            <button type="button" onClick={onOpenPrescription} className="flex-1 h-11 rounded-xl border border-white/20 text-white font-medium text-sm">
              Glasses prescription
            </button>
          </div>
        </div>
      </div>
      <BottomBar onBack={onBack} backLabel="Back to clients" onNext={onBack} nextLabel="Home" />
    </Shell>
  );
}

// ============================================================================
// VISION TESTING REVIEW
// ============================================================================
export function VisionTestingReview({
  client, onBack, onStartNewTest,
}: {
  client: ClientRecord;
  onBack: () => void;
  onStartNewTest: () => void;
}) {
  const { sessionRepo } = useData();
  const [sessionData, setSessionData] = useState<{ session: any; payload: Record<string, any> } | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (sessionRepo && client.localId) {
      sessionRepo.getLatestSessionPayloadForClient(client.localId).then(res => {
        if (isMounted) setSessionData(res);
      });
    }
    return () => { isMounted = false; };
  }, [sessionRepo, client.localId]);

  const payload = sessionData?.payload || {};

  const distanceDispensed = !!(payload.distanceGlassesDispensed || payload.distanceGlassesFrameType);
  const readingDispensed = !!(payload.readingGlassesDispensed || payload.hasReadingGlasses === 'Yes');
  const sunglassesDispensed = !!(payload.sunglassesDispensed === true || payload.sunglassesDispensed === 'Yes');

  const totalPaid = payload.totalPaid || payload.price || payload.amountPaid || '0';

  const displayNum = sessionData?.session?.displayTestNumber
    ? `Test #${sessionData.session.displayTestNumber}`
    : `Client #${client.clientId}`;

  const createdStr = sessionData?.session?.createdAt
    ? new Date(sessionData.session.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  const completedStr = sessionData?.session?.completedAt
    ? new Date(sessionData.session.completedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : (sessionData?.session?.status ? `Status: ${sessionData.session.status}` : 'In progress');

  const distanceRows: [string, string][] = distanceDispensed ? [
    ['Right lens', payload.wheelRightEye || payload.wheelRightPower || payload.rightDistanceNoGlasses || 'Plano (+0.00)'],
    ['Left lens', payload.wheelLeftEye || payload.wheelLeftPower || payload.leftDistanceNoGlasses || 'Plano (+0.00)'],
    ['Frame type', payload.distanceGlassesFrameType || 'Plastic'],
    ['Front colour', payload.distanceGlassesFrontColour || 'N/A'],
    ['Right arm', payload.distanceGlassesRightArmColour || 'N/A'],
    ['Left arm', payload.distanceGlassesLeftArmColour || 'N/A'],
    ['Frame size', payload.distanceGlassesFrameSize || 'Medium'],
  ] : [
    ['Status', 'Not dispensed'],
  ];

  const readingRows: [string, string][] = readingDispensed ? [
    ['Right lens', payload.nearNoGlasses || payload.nearWithGlasses || 'Plano (+1.00)'],
    ['Left lens', payload.nearNoGlasses || payload.nearWithGlasses || 'Plano (+1.00)'],
    ['Frame type', payload.readingGlassesFrameType || 'Plastic'],
    ['Front colour', payload.readingGlassesFrontColour || 'N/A'],
    ['Right arm', payload.readingGlassesRightArmColour || 'N/A'],
    ['Left arm', payload.readingGlassesLeftArmColour || 'N/A'],
    ['Frame size', payload.readingGlassesFrameSize || 'Medium'],
  ] : [
    ['Status', 'Not dispensed'],
  ];

  const sunglassesRows: [string, string][] = sunglassesDispensed ? [
    ['Frame type', payload.sunglassesModel || payload.sunglassesType || 'OOXii UV Sunglasses'],
  ] : [
    ['Status', 'Not dispensed'],
  ];

  return (
    <Shell showProgress={false}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-4">
        <Breadcrumb path={['Home', 'Clients', 'Vision testing']} />
        <h1 className="text-2xl font-light">Vision testing</h1>
        <p className="text-sm text-[#9B93BA]">
          Completed vision testing runs for this client. Review the dispensed products for each saved session.
        </p>

        <SessionHeader session={displayNum} created={createdStr} completed={completedStr} />

        <ReviewCard title="Distance Glasses Dispensed" rows={distanceRows} complete={distanceDispensed} />
        <ReviewCard title="Reading Glasses Dispensed" rows={readingRows} complete={readingDispensed} />
        <ReviewCard
          title="Sunglasses Dispensed"
          rows={sunglassesRows}
          complete={sunglassesDispensed}
          footer={
            <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5">
              <span className="text-xs uppercase tracking-wider text-[#9B93BA] font-semibold">Total Paid</span>
              <span className="text-lg font-bold text-[#A984FF]">A$ {totalPaid}</span>
            </div>
          }
        />
      </div>
      <BottomBar onBack={onBack} backLabel="Back to profile" onNext={onStartNewTest} nextLabel="Start new test" />
    </Shell>
  );
}

// ============================================================================
// CLIENT GLASSES PRESCRIPTION
// ============================================================================
export function ClientGlassesPrescription({
  client, onBack,
}: {
  client: ClientRecord;
  onBack: () => void;
}) {
  const { sessionRepo } = useData();
  const [sessionData, setSessionData] = useState<{ session: any; payload: Record<string, any> } | null>(null);
  const [view, setView] = useState<'Ophthalmologist' | 'Paediatrician'>('Ophthalmologist');

  useEffect(() => {
    let isMounted = true;
    if (sessionRepo && client.localId) {
      sessionRepo.getLatestSessionPayloadForClient(client.localId).then(res => {
        if (isMounted) setSessionData(res);
      });
    }
    return () => { isMounted = false; };
  }, [sessionRepo, client.localId]);

  const payload = sessionData?.payload || {};

  const displayNum = sessionData?.session?.displayTestNumber
    ? `Test #${sessionData.session.displayTestNumber}`
    : `Client #${client.clientId}`;

  const createdStr = sessionData?.session?.createdAt
    ? new Date(sessionData.session.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  const completedStr = sessionData?.session?.completedAt
    ? new Date(sessionData.session.completedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : (sessionData?.session?.status ? `Status: ${sessionData.session.status}` : 'In progress');

  const rightSph = payload.wheelRightPower || payload.wheelRightDirection || payload.rightDistanceNoGlasses || 'Plano';
  const leftSph = payload.wheelLeftPower || payload.wheelLeftDirection || payload.leftDistanceNoGlasses || 'Plano';

  const nearPower = payload.nearNoGlasses || payload.nearWithGlasses || 'N/A';

  return (
    <Shell showProgress={false}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-4">
        <Breadcrumb path={['Home', 'Clients', 'Glasses prescription']} />
        <h1 className="text-2xl font-light">Client glasses prescription</h1>
        <p className="text-sm text-[#9B93BA]">
          Distance and near vision prescriptions derived from completed test sessions.
        </p>

        <SessionHeader session={displayNum} created={createdStr} completed={completedStr} />

        <div className="bg-[#22193B] border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Distance vision prescription</div>
            <span className="text-[10px] uppercase tracking-wider bg-[#A984FF]/15 text-[#A984FF] px-2 py-1 rounded-full border border-[#A984FF]/40 font-semibold">
              Wheel Test
            </span>
          </div>

          <div className="flex gap-1 bg-[#2A0730] p-1 rounded-full border border-white/10">
            {(['Ophthalmologist', 'Paediatrician'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`flex-1 h-9 rounded-full text-xs font-semibold transition-colors ${
                  view === v ? 'bg-white text-[#2A0730]' : 'text-white/60'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {view === 'Ophthalmologist' ? (
            <PrescriptionGrid
              rightEye={[['Sphere', rightSph], ['Cylinder', '0.00']]}
              leftEye={[['Sphere', leftSph], ['Cylinder', '0.00']]}
            />
          ) : (
            <PrescriptionGrid
              rightEye={[['SPH', rightSph], ['CYL', '0.00'], ['Axis', '—']]}
              leftEye={[['SPH', leftSph], ['CYL', '0.00'], ['Axis', '—']]}
            />
          )}

          <div>
            <div className="text-xs uppercase text-[#A984FF] tracking-wider font-semibold mb-2">Frames</div>
            <dl className="text-sm flex flex-col gap-1.5">
              <Row label="Type" value={payload.distanceGlassesFrameType || 'Plastic'} />
              <Row label="Front" value={payload.distanceGlassesFrontColour || 'N/A'} />
              <Row label="Right arm" value={payload.distanceGlassesRightArmColour || 'N/A'} />
              <Row label="Left arm" value={payload.distanceGlassesLeftArmColour || 'N/A'} />
              <Row label="Size" value={payload.distanceGlassesFrameSize || 'Medium'} />
            </dl>
          </div>
        </div>

        <ReviewCard
          title="Near vision (reading addition)"
          statusPill="Paddle Test"
          rows={[['Right eye', nearPower], ['Left eye', nearPower]]}
          footer={<p className="text-xs text-[#9B93BA] mt-2">Reading lens power — no cylinder conversion required.</p>}
        />

        <ReviewCard
          title="Sunglasses Dispensed"
          statusPill="Dispensed"
          rows={[['Frame type', payload.sunglassesModel || payload.sunglassesType || (payload.sunglassesDispensed ? 'OOXii UV Sunglasses' : 'Not dispensed')]]}
          footer={<p className="text-xs text-[#9B93BA] mt-2">Sunglasses do not carry prescription values.</p>}
        />
      </div>
      <BottomBar onBack={onBack} backLabel="Back to profile" onNext={onBack} nextLabel="Home" />
    </Shell>
  );
}

// ============================================================================
// SHARED HELPERS
// ============================================================================
function Breadcrumb({ path }: { path: string[] }) {
  return (
    <div className="text-sm text-[#E2D4F2] flex items-center gap-1.5 flex-wrap">
      {path.map((p, i) => (
        <React.Fragment key={p}>
          {i > 0 && <ChevronRight size={13} />}
          <span className={i === path.length - 1 ? 'text-white font-semibold' : ''}>{p}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 text-base">
      <dt className="text-[#E2D4F2]">{label}</dt>
      <dd className="text-white font-semibold text-right capitalize">{value}</dd>
    </div>
  );
}

function SessionHeader({ session, created, completed }: { session: string; created?: string; completed?: string }) {
  return (
    <div className="bg-[#2A0730] border border-white/10 rounded-2xl p-4">
      <div className="text-xl font-bold">{session}</div>
      <div className="text-sm text-[#E2D4F2] flex flex-col gap-0.5 mt-1 font-medium">
        <span>Created: {created || 'N/A'}</span>
        <span>Completed: {completed || 'N/A'}</span>
      </div>
    </div>
  );
}

function ReviewCard({
  title, statusPill = 'Dispensed', rows, footer, complete = true,
}: {
  title: string;
  statusPill?: string;
  rows: [string, string][];
  footer?: React.ReactNode;
  complete?: boolean;
}) {
  return (
    <div className="bg-[#22193B] border border-white/10 rounded-3xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">{title}</div>
        <span className={`text-xs uppercase tracking-wider px-2.5 py-1 rounded-full border font-bold ${
          complete
            ? 'bg-[#A984FF]/15 text-[#A984FF] border-[#A984FF]/40'
            : 'bg-white/5 text-[#9B93BA] border-white/10'
        }`}>
          {complete ? statusPill : 'Not Dispensed'}
        </span>
      </div>
      <dl className="text-base flex flex-col gap-1.5">
        {rows.map(([l, v]) => <Row key={l} label={l} value={v} />)}
      </dl>
      {footer}
    </div>
  );
}

function PrescriptionGrid({
  rightEye, leftEye,
}: { rightEye: [string, string][]; leftEye: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-[#2A0730] border border-white/10 rounded-2xl p-3.5">
        <div className="text-xs uppercase tracking-wider text-[#A984FF] font-bold mb-2">Right eye</div>
        <dl className="text-sm flex flex-col gap-1.5">
          {rightEye.map(([l, v]) => <Row key={l} label={l} value={v} />)}
        </dl>
      </div>
      <div className="bg-[#2A0730] border border-white/10 rounded-2xl p-3.5">
        <div className="text-xs uppercase tracking-wider text-[#A984FF] font-bold mb-2">Left eye</div>
        <dl className="text-sm flex flex-col gap-1.5">
          {leftEye.map(([l, v]) => <Row key={l} label={l} value={v} />)}
        </dl>
      </div>
    </div>
  );
}
