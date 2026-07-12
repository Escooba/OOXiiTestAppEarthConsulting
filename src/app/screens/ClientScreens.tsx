import React, { useState, useMemo } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { Search, RotateCw, ChevronRight, Edit3, MapPin, ChevronLeft } from 'lucide-react';
import { ScreenId } from '../lib/theme';

export interface ClientRecord {
  clientId: string;
  testerName: string;
  gender: string;
  yearOfBirth: number;
  cataractSurgery: string;
  region: string;
  latestSessionId: string;
}

export const MOCK_CLIENTS: ClientRecord[] = [
  { clientId: '82016', testerName: 'John Smith', gender: 'Female', yearOfBirth: 1966, cataractSurgery: 'No', region: 'Albion Park, NSW, AU', latestSessionId: '#182' },
  { clientId: '82017', testerName: 'John Smith', gender: 'Male', yearOfBirth: 1974, cataractSurgery: 'Yes, right eye', region: 'Wollongong, NSW, AU', latestSessionId: '#183' },
  { clientId: '82018', testerName: 'John Smith', gender: 'Female', yearOfBirth: 1958, cataractSurgery: 'No', region: 'Sydney, NSW, AU', latestSessionId: '#184' },
  { clientId: '82019', testerName: 'John Smith', gender: 'Male', yearOfBirth: 1989, cataractSurgery: 'No', region: 'Newcastle, NSW, AU', latestSessionId: '#185' },
  { clientId: '82020', testerName: 'John Smith', gender: 'Female', yearOfBirth: 1972, cataractSurgery: 'Yes, both eyes', region: 'Sydney, NSW, AU', latestSessionId: '#186' },
  { clientId: '82021', testerName: 'John Smith', gender: 'Male', yearOfBirth: 1963, cataractSurgery: 'No', region: 'Wollongong, NSW, AU', latestSessionId: '#187' },
  { clientId: '82022', testerName: 'John Smith', gender: 'Female', yearOfBirth: 1981, cataractSurgery: 'No', region: 'Sydney, NSW, AU', latestSessionId: '#188' },
  { clientId: '82023', testerName: 'John Smith', gender: 'Female', yearOfBirth: 1950, cataractSurgery: 'Yes, left eye', region: 'Albion Park, NSW, AU', latestSessionId: '#189' },
  { clientId: '82024', testerName: 'John Smith', gender: 'Male', yearOfBirth: 1995, cataractSurgery: 'No', region: 'Sydney, NSW, AU', latestSessionId: '#190' },
  { clientId: '82025', testerName: 'John Smith', gender: 'Female', yearOfBirth: 1968, cataractSurgery: 'No', region: 'Newcastle, NSW, AU', latestSessionId: '#191' },
];

// ============================================================================
// FIND A CLIENT
// ============================================================================
import { useClients } from '../../data/hooks';

export function FindClient({
  onBack, onOpenProfile,
}: {
  onBack: () => void;
  onOpenProfile: (c: any) => void;
}) {
  const [query, setQuery] = useState('');
  const { clients, refresh } = useClients();

  const mappedClients = useMemo(() => clients.map(c => ({
    clientId: c.ooxiiClientId,
    testerName: 'Current Tester', // Would ideally fetch tester name or join it
    gender: c.gender,
    yearOfBirth: c.yearOfBirth,
    cataractSurgery: c.cataractSurgery,
    region: `${c.city}, ${c.stateProvince}, ${c.country}`,
    latestSessionId: 'Recent',
  })), [clients]);

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
        <Breadcrumb path={['Home', 'Clients']} />
        <h1 className="text-2xl font-light">Find a client</h1>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-white/10 text-[#150F26]">
            <Search size={18} className="text-[#6A608A]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Quick search for a client"
              className="flex-1 bg-transparent outline-none text-sm placeholder-[#9B93BA]"
            />
          </div>
          <button
            aria-label="Refresh client list"
            className="w-12 h-12 rounded-2xl bg-[#22193B] border border-white/10 flex items-center justify-center text-white hover:border-[#00D1C1]/40"
          >
            <RotateCw size={18} />
          </button>
        </div>

        <div className="text-xs text-[#9B93BA] uppercase tracking-wider font-semibold">
          {filtered.length} client{filtered.length === 1 ? '' : 's'}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((c) => (
            <button
              key={c.clientId}
              onClick={() => onOpenProfile(c)}
              className="text-left bg-[#22193B] border border-white/10 rounded-2xl p-4 hover:border-[#00D1C1]/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-[#9B93BA]">Tester: {c.testerName}</div>
                  <div className="text-lg font-medium text-white mt-0.5">Client ID: {c.clientId}</div>
                </div>
                <ChevronRight size={18} className="text-[#6A608A] mt-1" />
              </div>
              <div className="text-sm text-white/80 mt-2">{c.gender}, {c.yearOfBirth}</div>
              <div className="text-xs text-[#9B93BA] mt-1">Cataract surgery: {c.cataractSurgery}</div>
              <div className="text-xs text-[#9B93BA] mt-1 flex items-center gap-1">
                <MapPin size={11} /> {c.region}
              </div>
            </button>
          ))}
        </div>
      </div>
      <BottomBar onBack={onBack} nextLabel="New client" onNext={() => onBack()} backLabel="Home" />
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
  return (
    <Shell showProgress={false}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-4">
        <Breadcrumb path={['Home', 'Clients', 'Profile']} />
        <h1 className="text-2xl font-light">Client profile</h1>

        <div className="bg-[#22193B] border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#9B93BA] uppercase tracking-wider">Tester : {client.testerName}</div>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00D1C1]/15 border border-[#00D1C1]/40 text-[#00D1C1] text-xs font-semibold">
              <Edit3 size={12} /> Edit
            </button>
          </div>

          <div>
            <div className="text-xs uppercase text-[#00D1C1] tracking-wider font-semibold mb-2">Personal information</div>
            <dl className="text-sm flex flex-col gap-1.5">
              <Row label="Client ID" value={client.clientId} />
              <Row label="Gender" value={client.gender} />
              <Row label="Year of birth" value={String(client.yearOfBirth)} />
              <Row label="Cataract surgery" value={client.cataractSurgery} />
              <Row label="Region" value={client.region} />
            </dl>
          </div>
        </div>

        <h2 className="text-sm uppercase tracking-wider text-[#00D1C1] font-semibold mt-2">Test sessions</h2>

        <div className="bg-[#22193B] border border-white/10 rounded-3xl p-5 flex flex-col gap-3">
          <div className="text-lg font-medium">{client.latestSessionId}</div>
          <div className="text-xs text-[#9B93BA] flex flex-col gap-1">
            <span>Created: 31 May 2026 01:56 pm</span>
            <span>Completed: 31 May 2026 02:00 pm</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={onOpenVisionReview} className="flex-1 h-11 rounded-xl bg-[#00D1C1] text-[#150F26] font-semibold text-sm">
              Vision testing
            </button>
            <button onClick={onOpenPrescription} className="flex-1 h-11 rounded-xl border border-white/20 text-white font-medium text-sm">
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
  return (
    <Shell showProgress={false}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-4">
        <Breadcrumb path={['Home', 'Clients', 'Vision testing']} />
        <h1 className="text-2xl font-light">Vision testing</h1>
        <p className="text-sm text-[#9B93BA]">
          Completed vision testing runs for this client. Review the dispensed products for each saved session.
        </p>

        <SessionHeader session={client.latestSessionId} />

        <ReviewCard
          title="Distance Glasses Dispensed"
          rows={[
            ['Right lens', '-1.5'],
            ['Left lens', '-2.5'],
            ['Frame type', 'Plastic'],
            ['Front colour', 'Red'],
            ['Right arm', 'Black'],
            ['Left arm', 'Black'],
            ['Frame size', 'Medium'],
          ]}
        />

        <ReviewCard
          title="Reading Glasses Dispensed"
          rows={[
            ['Right lens', '-1.0'],
            ['Left lens', '+1.0'],
            ['Frame type', 'Plastic'],
            ['Front colour', 'Black'],
            ['Right arm', 'Yellow'],
            ['Left arm', 'Yellow'],
            ['Frame size', 'Medium'],
          ]}
        />

        <ReviewCard
          title="Sunglasses Dispensed"
          rows={[['Frame type', 'OOXii metal frame mirrored']]}
          footer={
            <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5">
              <span className="text-xs uppercase tracking-wider text-[#9B93BA] font-semibold">Total</span>
              <span className="text-lg font-bold text-[#00D1C1]">A$ 1000</span>
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
  const [view, setView] = useState<'Ophthalmologist' | 'Paediatrician'>('Ophthalmologist');

  return (
    <Shell showProgress={false}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-4">
        <Breadcrumb path={['Home', 'Clients', 'Glasses prescription']} />
        <h1 className="text-2xl font-light">Client glasses prescription</h1>
        <p className="text-sm text-[#9B93BA]">
          Distance and near vision prescriptions derived from completed test sessions.
        </p>

        <SessionHeader session={client.latestSessionId} />

        <div className="bg-[#22193B] border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Distance vision prescription</div>
            <span className="text-[10px] uppercase tracking-wider bg-[#00D1C1]/15 text-[#00D1C1] px-2 py-1 rounded-full border border-[#00D1C1]/40 font-semibold">
              Wheel Test
            </span>
          </div>

          <div className="flex gap-1 bg-[#150F26] p-1 rounded-full border border-white/10">
            {(['Ophthalmologist', 'Paediatrician'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 h-9 rounded-full text-xs font-semibold transition-colors ${
                  view === v ? 'bg-white text-[#150F26]' : 'text-white/60'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {view === 'Ophthalmologist' ? (
            <PrescriptionGrid
              rightEye={[['Sphere', '-2.5'], ['Cylinder', '0.00']]}
              leftEye={[['Sphere', '-2.5'], ['Cylinder', '0.00']]}
            />
          ) : (
            <PrescriptionGrid
              rightEye={[['SPH', '-2.5'], ['CYL', '0.00'], ['Axis', '—']]}
              leftEye={[['SPH', '-2.5'], ['CYL', '0.00'], ['Axis', '—']]}
            />
          )}

          <div>
            <div className="text-xs uppercase text-[#00D1C1] tracking-wider font-semibold mb-2">Frames</div>
            <dl className="text-sm flex flex-col gap-1.5">
              <Row label="Type" value="Plastic" />
              <Row label="Front" value="Red" />
              <Row label="Right arm" value="Black" />
              <Row label="Left arm" value="Black" />
              <Row label="Size" value="Medium" />
            </dl>
          </div>
        </div>

        <ReviewCard
          title="Near vision (reading addition)"
          statusPill="Paddle Test"
          rows={[['Right eye', '-1.0'], ['Left eye', '+1.0']]}
          footer={<p className="text-xs text-[#9B93BA] mt-2">Reading lens power — no cylinder conversion required.</p>}
        />

        <ReviewCard
          title="Sunglasses Dispensed"
          statusPill="Dispensed"
          rows={[['Frame type', 'OOXii metal frame mirrored']]}
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
    <div className="text-xs text-[#9B93BA] flex items-center gap-1.5 flex-wrap">
      {path.map((p, i) => (
        <React.Fragment key={p}>
          {i > 0 && <ChevronRight size={11} />}
          <span className={i === path.length - 1 ? 'text-white' : ''}>{p}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-[#9B93BA]">{label}</dt>
      <dd className="text-white font-medium text-right">{value}</dd>
    </div>
  );
}

function SessionHeader({ session }: { session: string }) {
  return (
    <div className="bg-[#150F26] border border-white/10 rounded-2xl p-4">
      <div className="text-lg font-medium">{session}</div>
      <div className="text-xs text-[#9B93BA] flex flex-col gap-0.5 mt-1">
        <span>Created: 31 May 2026 01:56 pm</span>
        <span>Completed: 31 May 2026 02:00 pm</span>
      </div>
    </div>
  );
}

function ReviewCard({
  title, statusPill = 'Dispensed', rows, footer,
}: {
  title: string;
  statusPill?: string;
  rows: [string, string][];
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-[#22193B] border border-white/10 rounded-3xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">{title}</div>
        <span className="text-[10px] uppercase tracking-wider bg-[#00D1C1]/15 text-[#00D1C1] px-2 py-1 rounded-full border border-[#00D1C1]/40 font-semibold">
          {statusPill}
        </span>
      </div>
      <dl className="text-sm flex flex-col gap-1.5">
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
      <div className="bg-[#150F26] border border-white/10 rounded-2xl p-3">
        <div className="text-[10px] uppercase tracking-wider text-[#9B93BA] font-semibold mb-2">Right eye</div>
        <dl className="text-xs flex flex-col gap-1">
          {rightEye.map(([l, v]) => <Row key={l} label={l} value={v} />)}
        </dl>
      </div>
      <div className="bg-[#150F26] border border-white/10 rounded-2xl p-3">
        <div className="text-[10px] uppercase tracking-wider text-[#9B93BA] font-semibold mb-2">Left eye</div>
        <dl className="text-xs flex flex-col gap-1">
          {leftEye.map(([l, v]) => <Row key={l} label={l} value={v} />)}
        </dl>
      </div>
    </div>
  );
}
