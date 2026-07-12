import React, { useState, useEffect } from 'react';
import { ScreenId, calcSnellen } from './lib/theme';
import { ThemeProvider } from './lib/ThemeContext';
import { ShellNavProvider } from './components/Shell';
import { Login } from './screens/Login';
import { SignupEmail } from './screens/SignupEmail';
import { TesterInfo } from './screens/TesterInfo';
import { AdditionalInfo } from './screens/AdditionalInfo';
import { FirstLoginGuide } from './screens/FirstLoginGuide';
import { Home } from './screens/Home';
import { ClientInfo } from './screens/ClientInfo';
import { QuestionScreen } from './screens/QuestionScreen';
import { LineTestScreen } from './screens/LineTestScreen';
import { DistanceLeftEye } from './screens/DistanceLeftEye';
import { WheelPDScreen, WheelLensScreen, WheelRightDistanceScreen } from './screens/WheelScreens';
import { FinalSummary } from './screens/FinalSummary';
import { Profile } from './screens/Profile';
import { Garden } from './screens/Garden';
import { Tutorial } from './screens/Tutorial';
import { SunglassesSelection } from './screens/SunglassesScreens';
import {
  GlassesDispensedReview,
  FinalChecklist,
  AdditionalDetails,
  TestResultsSaved,
} from './screens/EndOfFlow';
import {
  FindClient,
  ClientProfileScreen,
  VisionTestingReview,
  ClientGlassesPrescription,
  ClientRecord,
} from './screens/ClientScreens';

// Data Layer Imports
import { useTester, useActiveSession } from '../data/hooks';
import { useData } from '../data/DataProvider';
import type { SectionType } from '../data/models';

const CLINICAL_SCREENS: ScreenId[] = [
  'glasses-question', 'distance-right', 'distance-left', 'distance-both-glasses',
  'near-no-glasses', 'reading-glasses-question', 'near-own-glasses',
  'wheel-pd', 'wheel-right-lens', 'wheel-right-distance', 'wheel-left-lens',
  'sunglasses-question', 'sunglasses-selection', 'dispensed-review',
  'final-checklist', 'additional-details',
];

function screenStepLabel(s: ScreenId): string {
  const map: Partial<Record<ScreenId, string>> = {
    'glasses-question': 'Glasses question',
    'distance-right': 'Distance vision — Right eye',
    'distance-left': 'Distance vision — Left eye',
    'distance-both-glasses': 'Distance vision — Both eyes with glasses',
    'near-no-glasses': 'Near vision — No glasses',
    'reading-glasses-question': 'Reading glasses question',
    'near-own-glasses': 'Near vision — Own glasses',
    'wheel-pd': 'Wheel test — PD',
    'wheel-right-lens': 'Wheel test — Right eye',
    'wheel-right-distance': 'Right distance vision at wheel',
    'wheel-left-lens': 'Wheel test — Left eye',
    'sunglasses-question': 'Sunglasses dispensed?',
    'sunglasses-selection': 'Sunglasses selection',
    'dispensed-review': 'Glasses Dispensed Review',
    'final-checklist': 'Final checklist',
    'additional-details': 'Additional details',
  };
  return map[s] || 'Current step';
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

function AppInner() {
  const { testerRepo, clientRepo, workflowService, completionService } = useData();
  const { tester, refresh: refreshTester } = useTester();
  const { session: activeSession, refresh: refreshSession } = useActiveSession();

  const [screen, setScreen] = useState<ScreenId>('login');
  const [showGuide, setShowGuide] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(() => {
    return !sessionStorage.getItem('region_modal_shown');
  });
  const [activeRegion, setActiveRegion] = useState(() => {
    return sessionStorage.getItem('active_region') || '';
  });

  // Client session state for UI rendering
  const [client, setClient] = useState<{ localId: string; ooxiiId: string; yearOfBirth: string; gender: string; cataract: string } | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});

  // Client-search flow state
  const [viewingClient, setViewingClient] = useState<ClientRecord | null>(null);
  const [returnToAfterProfile, setReturnToAfterProfile] = useState<ScreenId>('home');

  // Auto-login if tester exists and flagged as logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('ooxii_logged_in') === 'true';
    if (tester && screen === 'login' && isLoggedIn) {
      setScreen('home');
      if (!tester.firstLoginGuideCompleted) {
        setShowGuide(true);
      }
    }
  }, [tester, screen]);

  // Sync state with active session on load
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('ooxii_logged_in') === 'true';
    if (isLoggedIn && activeSession && activeSession.currentRoute) {
      // In a full implementation we'd also load the sections into `results`
      // For this prototype we'll just restore the routing state
      setScreen(activeSession.currentRoute as ScreenId);
    }
  }, [activeSession]);

  // Load client data if we have an active session but no client state
  useEffect(() => {
    if (activeSession && (!client || client.localId !== activeSession.clientId)) {
      clientRepo.findByLocalId(activeSession.clientId).then(c => {
        if (c) {
          setClient({
            localId: c.localId,
            ooxiiId: c.ooxiiClientId,
            yearOfBirth: String(c.yearOfBirth),
            gender: c.gender,
            cataract: c.cataractSurgery
          });
        }
      });
    }
  }, [activeSession, client, clientRepo]);

  const setResult = async (key: string, value: any, sectionType: SectionType = 'main_test') => {
    const updatedResults = { ...results, [key]: value };
    setResults(updatedResults);
    
    // Save to SQLite
    if (activeSession) {
      try {
        await workflowService.saveSection(activeSession.localId, sectionType, updatedResults);
      } catch (err) {
        console.error('Failed to save section:', err);
      }
    }
  };

  const nav = async (target: ScreenId) => {
    // If navigating inside a clinical flow, update the current route in SQLite
    if (activeSession && CLINICAL_SCREENS.includes(target)) {
      try {
        await workflowService.saveProgress(activeSession.localId, target);
        refreshSession();
      } catch (err) {
        console.error('Failed to save progress:', err);
      }
    }
    
    // Clear state if starting fresh
    if (target === 'client-info') {
      setResults({});
      if (activeSession) {
        try {
          await workflowService.cancelTest(activeSession.localId);
          await refreshSession();
        } catch (err) {
          console.error('Failed to cancel test:', err);
        }
      }
    }
    
    setScreen(target);
  };

  const inProgressCard = activeSession && activeSession.currentRoute
    ? {
        clientId: (client && client.localId === activeSession.clientId) ? client.ooxiiId : activeSession.clientId.slice(-5),
        step: screenStepLabel(activeSession.currentRoute as ScreenId),
        screen: activeSession.currentRoute as ScreenId
      }
    : null;

  const resumeTest = () => {
    if (activeSession?.currentRoute) {
      setScreen(activeSession.currentRoute as ScreenId);
    }
  };

  const content = renderScreen();

  return <ShellNavProvider onNav={nav}>{content}</ShellNavProvider>;

  function renderScreen() {
    switch (screen) {
      case 'login':
        return (
          <Login
            onLogin={async () => {
              if (!tester && testerRepo) {
                await testerRepo.createTester({
                  firstName: 'John', lastName: 'Smith', gender: 'Male',
                  country: 'Australia', stateProvince: 'New South Wales', city: 'Sydney',
                  role: 'Community Health Worker', experienceLevel: 'Experienced tester',
                  organisation: 'Lions Club',
                  firstLoginGuideCompleted: true, remoteId: null,
                });
                await refreshTester();
              }
              localStorage.setItem('ooxii_logged_in', 'true');
              setScreen('home');
            }}
            onCreateAccount={() => setScreen('signup-email')}
          />
        );

      case 'signup-email':
        return <SignupEmail onNext={() => setScreen('signup-tester')} onLogin={() => setScreen('login')} />;

      case 'signup-tester':
        return (
          <TesterInfo
            onBack={() => setScreen('signup-email')}
            onNext={async (d) => {
              // Create partial tester profile, to be completed next
              setResults({ signupTesterInfo: d });
              setScreen('signup-additional');
            }}
          />
        );

      case 'signup-additional':
        return (
          <AdditionalInfo
            onBack={() => setScreen('signup-tester')}
            onCreate={async (d) => {
              const tInfo = results.signupTesterInfo || {};
              await testerRepo.createTester({
                firstName: tInfo.firstName || 'New',
                lastName: tInfo.lastName || 'Tester',
                gender: tInfo.gender || '',
                country: tInfo.country || '',
                stateProvince: tInfo.state || '',
                city: tInfo.city || '',
                role: d.role,
                experienceLevel: d.experience,
                organisation: d.organisation,
                firstLoginGuideCompleted: d.experience !== 'New tester',
                remoteId: null,
              });
              await refreshTester();
              localStorage.setItem('ooxii_logged_in', 'true');
              if (d.experience === 'New tester') setShowGuide(true);
              setScreen('home');
            }}
          />
        );

      case 'home':
        return (
          <>
            <Home
              onNav={nav}
              testerName={tester ? `${tester.firstName} ${tester.lastName}` : 'Tester'}
              showRegionModal={showRegionModal}
              onRegionSaved={async (r) => {
                setActiveRegion(r);
                sessionStorage.setItem('active_region', r);
                sessionStorage.setItem('region_modal_shown', 'true');
                setShowRegionModal(false);
              }}
              region={activeRegion || (tester ? `${tester.city}, ${tester.stateProvince}, ${tester.country}` : '')}
              inProgressTest={inProgressCard}
              onResumeTest={resumeTest}
            />
            {showGuide && <FirstLoginGuide onDone={async () => {
              setShowGuide(false);
              if (tester) await testerRepo.updateGuideCompleted(tester.localId, true);
            }} />}
          </>
        );

      case 'client-info':
        return (
          <ClientInfo
            onCancel={() => nav('home')}
            onStart={async (d) => {
              if (!tester) return;
              try {
                // 1. Create client in SQLite
                const newClient = await clientRepo.create({
                  ooxiiClientId: d.ooxiiId,
                  yearOfBirth: parseInt(d.yearOfBirth) || 0,
                  gender: d.gender,
                  cataractSurgery: d.cataract,
                  country: tester.country,
                  stateProvince: tester.stateProvince,
                  city: tester.city,
                  createdByTesterId: tester.localId,
                });
                
                // 2. Start Test Session
                await workflowService.startNewTest(tester.localId, newClient.localId);
                
                setClient({ localId: newClient.localId, ...d });
                setResults({});
                await refreshSession();
                nav('glasses-question');
              } catch (err) {
                console.error('Failed to start test:', err);
              }
            }}
          />
        );

      case 'glasses-question':
        return (
          <QuestionScreen
            progress={8}
            title="Glasses"
            question="Does the client currently have a pair of distance glasses?"
            options={['Yes', 'No']}
            onBack={() => setScreen('client-info')}
            onNext={(v) => { setResult('hasDistanceGlasses', v, 'pretest'); nav('distance-right'); }}
          />
        );

      case 'distance-right':
        return (
          <LineTestScreen
            progress={10}
            title="Distance vision"
            subtitle="Right eye"
            instruction="No glasses, ask the person to cover their left eye with the palm of their hand."
            imageCaption="Client covers left eye"
            snellenLabel="Right eye distance vision no glasses — Snellen (metres)"
            onBack={() => setScreen('glasses-question')}
            onNext={(v) => { setResult('rightDistanceNoGlasses', v.snellen, 'pretest'); nav('distance-left'); }}
          />
        );

      case 'distance-left':
        return (
          <DistanceLeftEye
            onBack={() => setScreen('distance-right')}
            onNext={(d) => {
              setResult('leftDistanceNoGlasses', calcSnellen(d.line, d.letters), 'pretest');
              nav('distance-both-glasses');
            }}
          />
        );

      case 'distance-both-glasses':
        return (
          <LineTestScreen
            progress={11}
            title="Distance vision"
            subtitle="Own glasses, both eyes open"
            instruction="With own glasses, ask the person to use both eyes open."
            imageCaption="Client wearing glasses, both eyes open"
            snellenLabel="Both eyes distance vision with glasses — Snellen (metres)"
            onBack={() => setScreen('distance-left')}
            onNext={(v) => { setResult('bothEyesDistanceWithGlasses', v.snellen, 'pretest'); nav('near-no-glasses'); }}
          />
        );

      case 'near-no-glasses':
        return (
          <LineTestScreen
            progress={13}
            title="Near vision"
            subtitle="No glasses"
            instruction="Ask the person to use both eyes."
            imageCaption="Client holding near vision card"
            imageMarker="40cm"
            snellenLabel="Both eyes near vision no glasses — Snellen (metres)"
            showLetters={false}
            onBack={() => setScreen('distance-both-glasses')}
            onNext={(v) => { setResult('nearNoGlasses', v.snellen, 'pretest'); nav('reading-glasses-question'); }}
          />
        );

      case 'reading-glasses-question':
        return (
          <QuestionScreen
            progress={15}
            title="Near vision"
            subtitle="Reading glasses"
            question="Does the client currently have a pair of reading glasses?"
            options={['Yes', 'No']}
            onBack={() => setScreen('near-no-glasses')}
            onNext={(v) => { setResult('hasReadingGlasses', v, 'pretest'); nav('near-own-glasses'); }}
          />
        );

      case 'near-own-glasses':
        return (
          <LineTestScreen
            progress={18}
            title="Near vision"
            subtitle="Own glasses"
            instruction="With own glasses, ask the person to use both eyes."
            imageCaption="Client wearing glasses, holding near card"
            imageMarker="40cm"
            snellenLabel="Both eyes near vision with glasses — Snellen (metres)"
            showLetters={false}
            onBack={() => setScreen('reading-glasses-question')}
            onNext={(v) => { setResult('nearWithGlasses', v.snellen, 'pretest'); nav('wheel-pd'); }}
          />
        );

      case 'wheel-pd':
        return (
          <WheelPDScreen
            onBack={() => setScreen('near-own-glasses')}
            onNext={(pd) => { setResult('pd', pd, 'main_test'); nav('wheel-right-lens'); }}
          />
        );

      case 'wheel-right-lens':
        return (
          <WheelLensScreen
            side="right"
            progress={29}
            onBack={() => setScreen('wheel-pd')}
            onNext={(d) => { setResult('wheelRightEye', d.lens || d.lensDirection, 'main_test'); nav('wheel-right-distance'); }}
          />
        );

      case 'wheel-right-distance':
        return (
          <WheelRightDistanceScreen
            onBack={() => setScreen('wheel-right-lens')}
            onNext={(d) => { setResult('wheelRightDistance', d.snellen || d.improved, 'post_test'); nav('wheel-left-lens'); }}
          />
        );

      case 'wheel-left-lens':
        return (
          <WheelLensScreen
            side="left"
            progress={37}
            onBack={() => setScreen('wheel-right-distance')}
            onNext={(d) => { setResult('wheelLeftEye', d.lens || d.lensDirection, 'main_test'); nav('sunglasses-question'); }}
          />
        );

      case 'sunglasses-question':
        return (
          <QuestionScreen
            progress={90}
            title="Sunglasses"
            question="Were sunglasses dispensed to this client?"
            options={['Yes', 'No']}
            errorText="Select Yes or No before continuing."
            onBack={() => setScreen('wheel-left-lens')}
            onNext={(v) => {
              setResult('sunglassesDispensed', v === 'Yes', 'dispensing');
              nav(v === 'Yes' ? 'sunglasses-selection' : 'dispensed-review');
            }}
          />
        );

      case 'sunglasses-selection':
        return (
          <SunglassesSelection
            onBack={() => setScreen('sunglasses-question')}
            onNext={(t) => { setResult('sunglassesType', t, 'dispensing'); nav('dispensed-review'); }}
          />
        );

      case 'dispensed-review':
        return (
          <GlassesDispensedReview
            sunglassesDispensed={!!results.sunglassesDispensed}
            onBack={() => setScreen(results.sunglassesDispensed ? 'sunglasses-selection' : 'sunglasses-question')}
            onNext={(price) => { setResult('totalPaid', price, 'completion'); nav('final-checklist'); }}
          />
        );

      case 'final-checklist':
        return (
          <FinalChecklist
            onBack={() => setScreen('dispensed-review')}
            onNext={(state) => { setResult('finalChecklist', state, 'completion'); nav('additional-details'); }}
          />
        );

      case 'additional-details':
        return (
          <AdditionalDetails
            onBack={() => setScreen('final-checklist')}
            onSubmit={async (d) => {
              setResult('additionalDetails', d, 'completion');
              
              if (activeSession) {
                try {
                  // Atomic completion via Service
                  await completionService.completeTest(activeSession.localId, [
                    { type: 'completion', payload: { ...results, additionalDetails: d } }
                  ]);
                  await refreshSession();
                } catch (err) {
                  console.error('Failed to complete test:', err);
                }
              }
              
              setScreen('test-saved');
            }}
          />
        );

      case 'test-saved':
        return <TestResultsSaved onHome={() => { setClient(null); nav('home'); }} />;

      case 'final-summary':
        return (
          <FinalSummary
            onHome={() => nav('home')}
            rows={[
              { label: 'Client OOXii ID', value: client?.ooxiiId || '' },
              { label: 'Right eye — distance', value: results.rightDistanceNoGlasses || '' },
              { label: 'Left eye — distance', value: results.leftDistanceNoGlasses || '' },
              { label: 'Both eyes — with glasses', value: results.bothEyesDistanceWithGlasses || '' },
              { label: 'Near vision — no glasses', value: results.nearNoGlasses || '' },
              { label: 'Near vision — with glasses', value: results.nearWithGlasses || '' },
              { label: 'PD', value: results.pd ? `${results.pd} mm` : '' },
              { label: 'Right eye lens', value: results.wheelRightEye || '' },
              { label: 'Left eye lens', value: results.wheelLeftEye || '' },
            ]}
          />
        );

      case 'tester-profile':
        return <Profile onNav={nav} tester={tester as any} />;

      case 'community-garden':
        return <Garden onNav={nav} />;

      case 'tutorial':
        return <Tutorial onNav={nav} />;

      case 'find-client':
        return (
          <FindClient
            onBack={() => setScreen('home')}
            onOpenProfile={(c) => {
              setViewingClient(c);
              setReturnToAfterProfile('find-client');
              setScreen('client-profile');
            }}
          />
        );

      case 'client-profile':
        if (!viewingClient) { setScreen('find-client'); return <div />; }
        return (
          <ClientProfileScreen
            client={viewingClient}
            onBack={() => setScreen(returnToAfterProfile)}
            onOpenVisionReview={() => setScreen('vision-review')}
            onOpenPrescription={() => setScreen('client-prescription')}
          />
        );

      case 'vision-review':
        if (!viewingClient) { setScreen('find-client'); return <div />; }
        return (
          <VisionTestingReview
            client={viewingClient}
            onBack={() => setScreen('client-profile')}
            onStartNewTest={() => {
              // Same start logic
              if (!tester) return;
              clientRepo.create({
                ooxiiClientId: viewingClient.clientId,
                yearOfBirth: Number(viewingClient.yearOfBirth) || 0,
                gender: viewingClient.gender,
                cataractSurgery: viewingClient.cataractSurgery,
                country: tester.country, stateProvince: tester.stateProvince, city: tester.city,
                createdByTesterId: tester.localId,
              }).then(newClient => {
                workflowService.startNewTest(tester.localId, newClient.localId).then(() => {
                  setClient({ localId: newClient.localId, ooxiiId: viewingClient.clientId, yearOfBirth: String(viewingClient.yearOfBirth), gender: viewingClient.gender, cataract: viewingClient.cataractSurgery });
                  setResults({});
                  refreshSession();
                  nav('glasses-question');
                });
              });
            }}
          />
        );

      case 'client-prescription':
        if (!viewingClient) { setScreen('find-client'); return <div />; }
        return <ClientGlassesPrescription client={viewingClient} onBack={() => setScreen('client-profile')} />;

      default:
        return <SignupEmail onNext={() => setScreen('signup-tester')} onLogin={() => setScreen('login')} />;
    }
  }
}
