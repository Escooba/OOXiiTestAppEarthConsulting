import React, { useState, useEffect, useRef } from 'react';
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
import { VisionLineSelectionScreen } from './screens/VisionLineSelectionScreen';
import { VisionLettersScreen } from './screens/VisionLettersScreen';
import { VisionResultScreen } from './screens/VisionResultScreen';
import { WheelPDScreen } from './screens/WheelPDScreen';
import { WheelDirectionScreen } from './screens/WheelDirectionScreen';
import { WheelPowerScreen } from './screens/WheelPowerScreen';
import { WheelTwoColourScreen } from './screens/WheelTwoColourScreen';
import { WheelLine9Screen } from './screens/WheelLine9Screen';
import { WheelDistanceImprovedScreen } from './screens/WheelDistanceImprovedScreen';
import { WheelResultScreen } from './screens/WheelResultScreen';
import { getNextClinicalRoute, getPreviousClinicalRoute, getProgressForRoute } from './lib/clinicalFlow';
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
  'glasses-question', 'distance-right-line', 'distance-right-letters', 'distance-right-result',
  'distance-left-line', 'distance-left-letters', 'distance-left-result', 'distance-both-glasses-line',
  'distance-both-glasses-letters', 'distance-both-glasses-result', 'near-no-glasses-line', 'near-no-glasses-result',
  'reading-glasses-question', 'near-own-glasses-line', 'near-own-glasses-result', 'wheel-pd',
  'wheel-right-direction', 'wheel-right-power', 'wheel-right-two-colour', 'wheel-right-line-nine',
  'wheel-right-result', 'wheel-right-distance-improved', 'wheel-right-distance-line',
  'wheel-right-distance-letters', 'wheel-right-distance-result', 'wheel-left-direction',
  'wheel-left-power', 'wheel-left-two-colour', 'wheel-left-line-nine', 'wheel-left-result',
  'sunglasses-question', 'sunglasses-selection', 'dispensed-review', 'final-checklist', 'additional-details',
];

function screenStepLabel(s: ScreenId): string {
  if (s.startsWith('distance-right')) return 'Distance vision — Right eye';
  if (s.startsWith('distance-left')) return 'Distance vision — Left eye';
  if (s.startsWith('distance-both')) return 'Distance vision — Both eyes';
  if (s.startsWith('near-no-glasses')) return 'Near vision — No glasses';
  if (s.startsWith('near-own-glasses')) return 'Near vision — Own glasses';
  if (s === 'wheel-pd') return 'Wheel test — PD';
  if (s.startsWith('wheel-right-distance')) return 'Right distance vision at wheel';
  if (s.startsWith('wheel-right')) return 'Wheel test — Right eye';
  if (s.startsWith('wheel-left')) return 'Wheel test — Left eye';
  const map: Partial<Record<ScreenId, string>> = {
    'glasses-question': 'Glasses question',
    'reading-glasses-question': 'Reading glasses question',
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
  const { testerRepo, clientRepo, workflowService, completionService, db } = useData();
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
  const resultsRef = useRef<Record<string, any>>(results);

  // Client-search flow state
  const [viewingClient, setViewingClient] = useState<ClientRecord | null>(null);
  const [returnToAfterProfile, setReturnToAfterProfile] = useState<ScreenId>('home');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('ooxii_logged_in') === 'true';
    if (tester && screen === 'login' && isLoggedIn) {
      setScreen('home');
    }
  }, [tester, screen]);

  // Seed 300 tests for jon huh
  useEffect(() => {
    async function seedJonHuh() {
      if (!db || !testerRepo || !clientRepo || !workflowService || !completionService) return;
      if (localStorage.getItem('jon_huh_300_fixed')) return;
      try {
        const testers = await db.query<any>("SELECT local_id, first_name, last_name, country, state_province, city FROM tester_profiles");
        const jon = testers.find(t => String(t.first_name).toLowerCase() === 'jon' && String(t.last_name).toLowerCase() === 'huh');
        if (jon) {
          const jonId = jon.local_id;
          
          // Clean up the incorrectly seeded tests from previous attempt
          await db.run("DELETE FROM test_sessions WHERE client_id = 'client_auto'");
          
          const check = await db.query<{count: number}>("SELECT COUNT(*) as count FROM test_sessions WHERE tester_id = ? AND status = 'completed'", [jonId]);
          if (check[0] && Number(check[0].count) >= 300) {
            localStorage.setItem('jon_huh_300_fixed', 'true');
            return;
          }
          
          console.log('Seeding 300 full tests. This might take a second...');
          for (let i = 0; i < 300; i++) {
            const client = await clientRepo.create({
              ooxiiClientId: 'auto_client_' + i,
              yearOfBirth: 1980,
              gender: 'Female',
              cataractSurgery: 'No',
              country: jon.country || 'AU',
              stateProvince: jon.state_province || 'NSW',
              city: jon.city || 'Sydney',
              createdByTesterId: jonId
            });
            const session = await workflowService.startNewTest(jonId, client.localId);
            await completionService.completeTest(session.localId, []);
          }
          localStorage.setItem('jon_huh_300_fixed', 'true');
          window.location.reload();
        }
      } catch (e) {
        console.error(e);
      }
    }
    seedJonHuh();
  }, [db, testerRepo, clientRepo, workflowService, completionService]);

  // Sync state with active session on load
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('ooxii_logged_in') === 'true';
    if (isLoggedIn && activeSession && activeSession.currentRoute) {
      setScreen(activeSession.currentRoute as ScreenId);
      // Load all previous sections to hydrate `results`
      workflowService.sessionRepo.getAllSections(activeSession.localId).then(sections => {
        let loaded: Record<string, any> = {};
        sections.forEach(s => {
          loaded = { ...loaded, ...s.payload };
        });
        setResults(loaded);
        resultsRef.current = loaded;
      }).catch(err => console.error('Failed to load session sections', err));
    }
  }, [activeSession, workflowService]);

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
    const finalResults = { ...resultsRef.current, [key]: value };
    resultsRef.current = finalResults;
    setResults(finalResults);
    
    // Save to SQLite
    if (activeSession) {
      try {
        await workflowService.saveSection(activeSession.localId, sectionType, finalResults);
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
      resultsRef.current = {};
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

  const handleClinicalNext = () => {
    const next = getNextClinicalRoute(screen, results);
    nav(next);
  };
  const handleClinicalBack = () => {
    const prev = getPreviousClinicalRoute(screen, results);
    nav(prev);
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
              setShowGuide(true);
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
            progress={getProgressForRoute(screen)}
            title="Glasses"
            question="Does the client currently have a pair of distance glasses?"
            options={['Yes', 'No']}
            initialValue={results.hasDistanceGlasses}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('hasDistanceGlasses', v, 'pretest'); handleClinicalNext(); }}
          />
        );

      case 'distance-right-line':
        return (
          <VisionLineSelectionScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Right eye"
            instruction="No glasses, ask the person to cover their left eye with the palm of their hand."
            imageCaption="Client covers left eye"
            initialValue={results.distanceRightLine}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('distanceRightLine', v, 'pretest'); handleClinicalNext(); }}
          />
        );

      case 'distance-right-letters':
        return (
          <VisionLettersScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Right eye"
            initialValue={results.distanceRightLetters}
            onBack={handleClinicalBack}
            onNext={(v) => {
              setResult('distanceRightLetters', v, 'pretest');
              setResult('rightDistanceNoGlasses', calcSnellen(results.distanceRightLine, v), 'pretest');
              handleClinicalNext();
            }}
          />
        );

      case 'distance-right-result':
        return (
          <VisionResultScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Right eye"
            snellenLabel="Right eye distance vision no glasses — Snellen (metres)"
            snellen={results.rightDistanceNoGlasses}
            onBack={handleClinicalBack}
            onNext={handleClinicalNext}
          />
        );

      case 'distance-left-line':
        return (
          <VisionLineSelectionScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Left eye"
            instruction="No glasses, ask the person to cover their right eye with the palm of their hand."
            imageCaption="Client covers right eye"
            initialValue={results.distanceLeftLine}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('distanceLeftLine', v, 'pretest'); handleClinicalNext(); }}
          />
        );

      case 'distance-left-letters':
        return (
          <VisionLettersScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Left eye"
            initialValue={results.distanceLeftLetters}
            onBack={handleClinicalBack}
            onNext={(v) => {
              setResult('distanceLeftLetters', v, 'pretest');
              setResult('leftDistanceNoGlasses', calcSnellen(results.distanceLeftLine, v), 'pretest');
              handleClinicalNext();
            }}
          />
        );

      case 'distance-left-result':
        return (
          <VisionResultScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Left eye"
            snellenLabel="Left eye distance vision no glasses — Snellen (metres)"
            snellen={results.leftDistanceNoGlasses}
            onBack={handleClinicalBack}
            onNext={handleClinicalNext}
          />
        );

      case 'distance-both-glasses-line':
        return (
          <VisionLineSelectionScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Own glasses, both eyes open"
            instruction="With own glasses, ask the person to use both eyes open."
            imageCaption="Client wearing glasses, both eyes open"
            initialValue={results.distanceBothGlassesLine}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('distanceBothGlassesLine', v, 'pretest'); handleClinicalNext(); }}
          />
        );

      case 'distance-both-glasses-letters':
        return (
          <VisionLettersScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Own glasses, both eyes open"
            initialValue={results.distanceBothGlassesLetters}
            onBack={handleClinicalBack}
            onNext={(v) => {
              setResult('distanceBothGlassesLetters', v, 'pretest');
              setResult('bothEyesDistanceWithGlasses', calcSnellen(results.distanceBothGlassesLine, v), 'pretest');
              handleClinicalNext();
            }}
          />
        );

      case 'distance-both-glasses-result':
        return (
          <VisionResultScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Own glasses, both eyes open"
            snellenLabel="Both eyes distance vision with glasses — Snellen (metres)"
            snellen={results.bothEyesDistanceWithGlasses}
            onBack={handleClinicalBack}
            onNext={handleClinicalNext}
          />
        );

      case 'near-no-glasses-line':
        return (
          <VisionLineSelectionScreen
            progress={getProgressForRoute(screen)}
            title="Near vision"
            subtitle="No glasses"
            instruction="Ask the person to use both eyes."
            imageCaption="Client holding near vision card"
            imageMarker="40cm"
            initialValue={results.nearNoGlassesLine}
            onBack={handleClinicalBack}
            onNext={(v) => {
              setResult('nearNoGlassesLine', v, 'pretest');
              setResult('nearNoGlasses', calcSnellen(v, '0'), 'pretest');
              handleClinicalNext();
            }}
          />
        );

      case 'near-no-glasses-result':
        return (
          <VisionResultScreen
            progress={getProgressForRoute(screen)}
            title="Near vision"
            subtitle="No glasses"
            snellenLabel="Both eyes near vision no glasses — Snellen (metres)"
            snellen={results.nearNoGlasses}
            onBack={handleClinicalBack}
            onNext={handleClinicalNext}
          />
        );

      case 'reading-glasses-question':
        return (
          <QuestionScreen
            progress={getProgressForRoute(screen)}
            title="Near vision"
            subtitle="Reading glasses"
            question="Does the client currently have a pair of reading glasses?"
            options={['Yes', 'No']}
            initialValue={results.hasReadingGlasses}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('hasReadingGlasses', v, 'pretest'); handleClinicalNext(); }}
          />
        );

      case 'near-own-glasses-line':
        return (
          <VisionLineSelectionScreen
            progress={getProgressForRoute(screen)}
            title="Near vision"
            subtitle="Own glasses"
            instruction="With own glasses, ask the person to use both eyes."
            imageCaption="Client wearing glasses, holding near card"
            imageMarker="40cm"
            initialValue={results.nearOwnGlassesLine}
            onBack={handleClinicalBack}
            onNext={(v) => {
              setResult('nearOwnGlassesLine', v, 'pretest');
              setResult('nearWithGlasses', calcSnellen(v, '0'), 'pretest');
              handleClinicalNext();
            }}
          />
        );

      case 'near-own-glasses-result':
        return (
          <VisionResultScreen
            progress={getProgressForRoute(screen)}
            title="Near vision"
            subtitle="Own glasses"
            snellenLabel="Both eyes near vision with glasses — Snellen (metres)"
            snellen={results.nearWithGlasses}
            onBack={handleClinicalBack}
            onNext={handleClinicalNext}
          />
        );

      case 'wheel-pd':
        return (
          <WheelPDScreen
            progress={getProgressForRoute(screen)}
            initialValue={results.pd?.toString()}
            onBack={handleClinicalBack}
            onNext={(pd) => { setResult('pd', pd, 'main_test'); handleClinicalNext(); }}
          />
        );

      case 'wheel-right-direction':
        return (
          <WheelDirectionScreen
            side="right"
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelRightDirection}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('wheelRightDirection', v, 'main_test'); handleClinicalNext(); }}
          />
        );

      case 'wheel-right-power':
        return (
          <WheelPowerScreen
            side="right"
            direction={results.wheelRightDirection}
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelRightPower}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('wheelRightPower', v, 'main_test'); handleClinicalNext(); }}
          />
        );

      case 'wheel-right-two-colour':
        return (
          <WheelTwoColourScreen
            side="right"
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelRightTwoColour}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('wheelRightTwoColour', v, 'main_test'); handleClinicalNext(); }}
          />
        );

      case 'wheel-right-line-nine':
        return (
          <WheelLine9Screen
            side="right"
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelRightLine9}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('wheelRightLine9', v, 'main_test'); handleClinicalNext(); }}
          />
        );

      case 'wheel-right-result':
        return (
          <WheelResultScreen
            side="right"
            progress={getProgressForRoute(screen)}
            direction={results.wheelRightDirection}
            power={results.wheelRightPower}
            twoColour={results.wheelRightTwoColour}
            line9={results.wheelRightLine9}
            onBack={handleClinicalBack}
            onNext={() => {
              const res = results.wheelRightDirection.startsWith('Neither') ? results.wheelRightDirection : `${results.wheelRightDirection} ${results.wheelRightPower}`;
              setResult('wheelRightEye', res, 'main_test');
              handleClinicalNext();
            }}
          />
        );

      case 'wheel-right-distance-improved':
        return (
          <WheelDistanceImprovedScreen
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelRightDistanceImproved}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('wheelRightDistanceImproved', v, 'post_test'); handleClinicalNext(); }}
          />
        );

      case 'wheel-right-distance-line':
        return (
          <VisionLineSelectionScreen
            progress={getProgressForRoute(screen)}
            title="Right distance vision at the wheel"
            instruction="Ask the person to cover their left eye."
            imageCaption="Client covers left eye at wheel"
            initialValue={results.wheelRightDistanceLine}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('wheelRightDistanceLine', v, 'post_test'); handleClinicalNext(); }}
          />
        );

      case 'wheel-right-distance-letters':
        return (
          <VisionLettersScreen
            progress={getProgressForRoute(screen)}
            title="Right distance vision at the wheel"
            initialValue={results.wheelRightDistanceLetters}
            onBack={handleClinicalBack}
            onNext={(v) => {
              setResult('wheelRightDistanceLetters', v, 'post_test');
              setResult('wheelRightDistanceSnellen', calcSnellen(results.wheelRightDistanceLine, v), 'post_test');
              handleClinicalNext();
            }}
          />
        );

      case 'wheel-right-distance-result':
        return (
          <VisionResultScreen
            progress={getProgressForRoute(screen)}
            title="Right distance vision at the wheel"
            snellenLabel="Right eye distance vision at wheel — Snellen (metres)"
            snellen={results.wheelRightDistanceImproved === 'Yes' ? results.wheelRightDistanceSnellen : 'N/A (Did not improve)'}
            onBack={handleClinicalBack}
            onNext={() => {
              const val = results.wheelRightDistanceImproved === 'Yes' ? results.wheelRightDistanceSnellen : 'No';
              setResult('wheelRightDistance', val, 'post_test');
              handleClinicalNext();
            }}
          />
        );

      case 'wheel-left-direction':
        return (
          <WheelDirectionScreen
            side="left"
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelLeftDirection}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('wheelLeftDirection', v, 'main_test'); handleClinicalNext(); }}
          />
        );

      case 'wheel-left-power':
        return (
          <WheelPowerScreen
            side="left"
            direction={results.wheelLeftDirection}
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelLeftPower}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('wheelLeftPower', v, 'main_test'); handleClinicalNext(); }}
          />
        );

      case 'wheel-left-two-colour':
        return (
          <WheelTwoColourScreen
            side="left"
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelLeftTwoColour}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('wheelLeftTwoColour', v, 'main_test'); handleClinicalNext(); }}
          />
        );

      case 'wheel-left-line-nine':
        return (
          <WheelLine9Screen
            side="left"
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelLeftLine9}
            onBack={handleClinicalBack}
            onNext={(v) => { setResult('wheelLeftLine9', v, 'main_test'); handleClinicalNext(); }}
          />
        );

      case 'wheel-left-result':
        return (
          <WheelResultScreen
            side="left"
            progress={getProgressForRoute(screen)}
            direction={results.wheelLeftDirection}
            power={results.wheelLeftPower}
            twoColour={results.wheelLeftTwoColour}
            line9={results.wheelLeftLine9}
            onBack={handleClinicalBack}
            onNext={() => {
              const res = results.wheelLeftDirection.startsWith('Neither') ? results.wheelLeftDirection : `${results.wheelLeftDirection} ${results.wheelLeftPower}`;
              setResult('wheelLeftEye', res, 'main_test');
              handleClinicalNext();
            }}
          />
        );

      case 'sunglasses-question':
        return (
          <QuestionScreen
            progress={getProgressForRoute(screen)}
            title="Sunglasses"
            question="Were sunglasses dispensed to this client?"
            options={['Yes', 'No']}
            errorText="Select Yes or No before continuing."
            initialValue={results.sunglassesDispensed === true ? 'Yes' : (results.sunglassesDispensed === false ? 'No' : undefined)}
            onBack={handleClinicalBack}
            onNext={(v) => {
              setResult('sunglassesDispensed', v === 'Yes', 'dispensing');
              handleClinicalNext();
            }}
          />
        );

      case 'sunglasses-selection':
        return (
          <SunglassesSelection
            onBack={handleClinicalBack}
            onNext={(t) => { setResult('sunglassesType', t, 'dispensing'); handleClinicalNext(); }}
          />
        );

      case 'dispensed-review':
        return (
          <GlassesDispensedReview
            sunglassesDispensed={!!results.sunglassesDispensed}
            onBack={handleClinicalBack}
            onNext={(price) => { setResult('totalPaid', price, 'completion'); handleClinicalNext(); }}
          />
        );

      case 'final-checklist':
        return (
          <FinalChecklist
            onBack={handleClinicalBack}
            onNext={(state) => { setResult('finalChecklist', state, 'completion'); handleClinicalNext(); }}
          />
        );

      case 'additional-details':
        return (
          <AdditionalDetails
            onBack={handleClinicalBack}
            onSubmit={async (d) => {
              setResult('additionalDetails', d, 'completion');
              
              if (activeSession) {
                try {
                  // Atomic completion via Service
                  await completionService.completeTest(activeSession.localId, [
                    { type: 'completion', payload: { ...results, additionalDetails: d } }
                  ]);
                  await workflowService.sessionRepo.updateRoute(activeSession.localId, 'test-saved');
                  // We bypass nav() to not call saveProgress manually again for completion since completeTest handles it.
                  window.location.reload(); // Quick reset
                } catch (err) {
                  console.error('Failed to complete test:', err);
                }
              }
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
