import React, { useState, useEffect, useRef } from 'react';
import { ScreenId, calcSnellen } from './lib/theme';
import { ThemeProvider, useTheme } from './lib/ThemeContext';
import { AuthProvider, useAuthContext } from './lib/AuthProvider';
import { ShellNavProvider } from './components/Shell';
import { Login } from './screens/Login';
import { SignupEmail } from './screens/SignupEmail';
import { TesterInfo } from './screens/TesterInfo';
import { AdditionalInfo } from './screens/AdditionalInfo';
import { Home } from './screens/Home';
import { ClientInfo } from './screens/ClientInfo';
import { QuestionScreen } from './screens/QuestionScreen';
import { VisionLineSelectionScreen } from './screens/VisionLineSelectionScreen';
import { VisionLettersScreen } from './screens/VisionLettersScreen';
import { VisionResultScreen } from './screens/VisionResultScreen';
import { WheelPDScreen } from './screens/WheelPDScreen';
import { OnboardingGuide } from './components/OnboardingGuide';
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
import { DistanceGlassesDispensedScreen } from './screens/DistanceGlassesDispensedScreen';
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
import { useActiveSession } from '../data/hooks';
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
  'distance-glasses-dispensed', 'sunglasses-question', 'sunglasses-selection', 'dispensed-review', 'final-checklist', 'additional-details',
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
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppInner() {
  const { t } = useTheme();
  const { testerRepo, clientRepo, workflowService, completionService } = useData();
  const { account, tester, isLoading: isAuthLoading, signup, linkAccount, refreshAuth } = useAuthContext();
  const { session: activeSession, refresh: refreshSession } = useActiveSession();

  const [screen, setScreen] = useState<ScreenId>('login');
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

  // Persistence Error / Saving State
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSubmittingPatch, setIsSubmittingPatch] = useState(false);

  // Client-search flow state
  const [viewingClient, setViewingClient] = useState<any>(null);
  const [returnToAfterProfile, setReturnToAfterProfile] = useState<ScreenId>('home');
  const [pendingClientDraft, setPendingClientDraft] = useState<any>(null);
  const [signupState, setSignupState] = useState<any>({});
  const [showOnboardingGuide, setShowOnboardingGuide] = useState(false);

  // Auto-trigger onboarding guide on account creation / first run
  useEffect(() => {
    if (tester && tester.firstLoginGuideCompleted === false) {
      setShowOnboardingGuide(true);
    }
  }, [tester?.localId, tester?.firstLoginGuideCompleted]);

  // Route protection & auth synchronization
  useEffect(() => {
    if (isAuthLoading) return;
    if (account && tester) {
      if (['login', 'signup-email', 'signup-tester', 'signup-additional'].includes(screen)) {
        setScreen('home');
      }
    } else {
      if (!['login', 'signup-email', 'signup-tester', 'signup-additional'].includes(screen)) {
        setScreen('login');
      }
    }
  }, [account, tester, isAuthLoading]);

  // Sync state with active session on load with deterministic section restoration
  useEffect(() => {
    if (account && activeSession && workflowService) {
      workflowService.sessionRepo.getAllSections(activeSession.localId).then(sections => {
        const mergedResults: Record<string, any> = {};
        const priority: Record<string, number> = {
          pretest: 1,
          main_test: 2,
          post_test: 3,
          dispensing: 4,
          completion: 5,
        };
        const sorted = [...sections].sort((a, b) => {
          const pa = priority[a.sectionType] || 99;
          const pb = priority[b.sectionType] || 99;
          if (pa !== pb) return pa - pb;
          return a.updatedAt - b.updatedAt;
        });

        for (const sec of sorted) {
          if (sec.payload && typeof sec.payload === 'object') {
            Object.assign(mergedResults, sec.payload);
          }
        }

        resultsRef.current = mergedResults;
        setResults(mergedResults);

        if (activeSession.currentRoute && CLINICAL_SCREENS.includes(activeSession.currentRoute as ScreenId)) {
          setScreen(activeSession.currentRoute as ScreenId);
        }
      }).catch(err => console.error('Failed to load session sections:', err));
    }
  }, [account, activeSession?.localId, workflowService]);

  // Load client data if active session exists
  useEffect(() => {
    if (activeSession && clientRepo && (!client || client.localId !== activeSession.clientId)) {
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

  const nav = async (target: ScreenId) => {
    if (activeSession && CLINICAL_SCREENS.includes(target) && workflowService) {
      try {
        await workflowService.saveProgress(activeSession.localId, target);
        await refreshSession();
      } catch (err) {
        console.error('Failed to save progress:', err);
      }
    }
    
    if (target === 'client-info') {
      setResults({});
      resultsRef.current = {};
      if (activeSession && workflowService) {
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

  /**
   * Primary clinical patch operation:
   * Disables progression controls, saves section patch payload to SQLite,
   * saves route to SQLite, and navigates only after both writes succeed.
   * Remains on current screen if persistence fails with clear retry error.
   */
  const saveResultPatchAndNavigate = async ({
    sectionType,
    patch,
    nextScreen,
  }: {
    sectionType: SectionType;
    patch: Record<string, any>;
    nextScreen: ScreenId;
  }) => {
    if (isSubmittingPatch) return;
    setIsSubmittingPatch(true);
    setSaveError(null);

    const merged = { ...resultsRef.current, ...patch };
    resultsRef.current = merged;
    setResults(merged);

    if (activeSession && workflowService) {
      try {
        await workflowService.saveSectionPatch(activeSession.localId, sectionType, patch);
        await workflowService.saveProgress(activeSession.localId, nextScreen);
        await refreshSession();
        setScreen(nextScreen);
      } catch (err: any) {
        console.error('Persistence failed during clinical navigation:', err);
        setSaveError('Failed to save test progress to local database. Please try again.');
      } finally {
        setIsSubmittingPatch(false);
      }
    } else {
      setScreen(nextScreen);
      setIsSubmittingPatch(false);
    }
  };

  const handleClinicalBack = () => {
    setSaveError(null);
    const prev = getPreviousClinicalRoute(screen, resultsRef.current);
    nav(prev);
  };

  const handleClinicalNext = () => {
    setSaveError(null);
    const next = getNextClinicalRoute(screen, resultsRef.current);
    nav(next);
  };

  const resumeTest = () => {
    if (activeSession && activeSession.currentRoute) {
      setScreen(activeSession.currentRoute as ScreenId);
    }
  };

  const cancelActiveTest = async () => {
    if (activeSession && workflowService) {
      try {
        await workflowService.cancelTest(activeSession.localId);
        setResults({});
        resultsRef.current = {};
        setClient(null);
        await refreshSession();
        setScreen('home');
      } catch (err) {
        console.error('Failed to cancel active test session:', err);
      }
    }
  };

  const inProgressCard = activeSession && activeSession.currentRoute
    ? {
        clientId: (client && client.localId === activeSession.clientId) ? client.ooxiiId : activeSession.clientId.slice(-5),
        step: screenStepLabel(activeSession.currentRoute as ScreenId),
        screen: activeSession.currentRoute as ScreenId,
      }
    : null;

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#551A8B] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-white/20 border-t-[#A984FF] rounded-full animate-spin" />
          <span className="text-sm font-medium text-[#BCA9CC]">Loading OOXii...</span>
        </div>
      </div>
    );
  }

  return (
    <ShellNavProvider onNav={nav} hasInProgressTest={!!activeSession} onCancelTest={cancelActiveTest}>
      {saveError && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-red-600 text-white px-4 py-3 text-center text-sm font-semibold shadow-lg flex justify-between items-center">
          <span>{saveError}</span>
          <button onClick={() => setSaveError(null)} className="ml-4 underline text-xs">Dismiss</button>
        </div>
      )}
      {renderScreen()}
      {showOnboardingGuide && (
        <OnboardingGuide
          onNav={setScreen}
          onComplete={async () => {
            setShowOnboardingGuide(false);
            if (testerRepo && tester) {
              await testerRepo.updateGuideCompleted(tester.localId, true);
              await refreshAuth();
            }
            setScreen('home');
          }}
        />
      )}
    </ShellNavProvider>
  );

  function renderScreen() {
    switch (screen) {
      case 'login':
        return (
          <Login
            onLoginSuccess={() => {
              sessionStorage.removeItem('region_modal_shown');
              setShowRegionModal(true);
              setScreen('home');
            }}
            onCreateAccount={() => setScreen('signup-email')}
          />
        );

      case 'signup-email':
        return (
          <SignupEmail 
            onNext={(email, pw) => {
              setSignupState({ email, pw });
              setScreen('signup-tester');
            }} 
            onLogin={() => setScreen('login')} 
          />
        );

      case 'signup-tester':
        return (
          <TesterInfo
            onBack={() => setScreen('signup-email')}
            onNext={async (d) => {
              setSignupState((prev: any) => ({ ...prev, ...d }));
              setScreen('signup-additional');
            }}
          />
        );

      case 'signup-additional':
        return (
          <AdditionalInfo
            onBack={() => setScreen('signup-tester')}
            onCreate={async (d) => {
              try {
                await signup(signupState.email, signupState.pw, {
                  firstName: signupState.firstName,
                  lastName: signupState.lastName,
                  gender: signupState.gender,
                  country: signupState.country,
                  stateProvince: signupState.state,
                  city: signupState.city,
                  role: d.role,
                  experienceLevel: d.experience,
                  organisation: d.organisation,
                  firstLoginGuideCompleted: false,
                  remoteId: null
                });
                sessionStorage.setItem('region_modal_shown', 'true');
                setShowRegionModal(false);
                setShowOnboardingGuide(true);
                setScreen('home');
              } catch (e: any) {
                alert(e.message || 'Signup failed');
              }
            }}
          />
        );

      case 'home':
        return (
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
            onCancelTest={cancelActiveTest}
          />
        );

      case 'client-info':
        return (
          <ClientInfo
            onCancel={() => nav('home')}
            onStart={async (d) => {
              if (!tester || !clientRepo || !workflowService) return;
              try {
                const existing = await clientRepo.findByOoxiiId(d.ooxiiId, tester.localId);
                let targetClientId: string;

                if (existing) {
                  targetClientId = existing.localId;
                  setPendingClientDraft(null);
                } else {
                  targetClientId = `draft_${d.ooxiiId}_${Date.now()}`;
                  setPendingClientDraft({
                    ooxiiClientId: d.ooxiiId,
                    yearOfBirth: parseInt(d.yearOfBirth) || 0,
                    gender: d.gender,
                    cataractSurgery: d.cataract,
                    country: tester.country,
                    stateProvince: tester.stateProvince,
                    city: tester.city,
                    createdByTesterId: tester.localId,
                  });
                }

                await workflowService.startNewTest(tester.localId, targetClientId);
                setClient({ localId: targetClientId, ooxiiId: d.ooxiiId, yearOfBirth: d.yearOfBirth, gender: d.gender, cataract: d.cataract });
                setResults({});
                await refreshSession();
                nav('glasses-question');
              } catch (err) {
                console.error('Failed to start new test:', err);
                setSaveError('Failed to start test. Please try again.');
              }
            }}
          />
        );

      case 'glasses-question':
        return (
          <QuestionScreen
            progress={getProgressForRoute(screen)}
            title={t('clinical.glasses_title')}
            question={t('clinical.distance_glasses_q')}
            options={['Yes', 'No']}
            helpConfigId="distance-glasses-question"
            initialValue={results.hasDistanceGlasses}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'pretest',
                patch: { hasDistanceGlasses: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
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
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'main_test',
                patch: { distanceRightLine: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'distance-right-letters':
        return (
          <VisionLettersScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Right eye"
            initialValue={results.distanceRightLetters}
            selectedLine={results.distanceRightLine}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'main_test',
                patch: {
                  distanceRightLetters: v,
                  rightDistanceNoGlasses: calcSnellen(resultsRef.current.distanceRightLine, v),
                },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
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
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'main_test',
                patch: { distanceLeftLine: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'distance-left-letters':
        return (
          <VisionLettersScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Left eye"
            initialValue={results.distanceLeftLetters}
            selectedLine={results.distanceLeftLine}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'main_test',
                patch: {
                  distanceLeftLetters: v,
                  leftDistanceNoGlasses: calcSnellen(resultsRef.current.distanceLeftLine, v),
                },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
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
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'main_test',
                patch: { distanceBothGlassesLine: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'distance-both-glasses-letters':
        return (
          <VisionLettersScreen
            progress={getProgressForRoute(screen)}
            title="Distance vision"
            subtitle="Own glasses, both eyes open"
            initialValue={results.distanceBothGlassesLetters}
            selectedLine={results.distanceBothGlassesLine}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'main_test',
                patch: {
                  distanceBothGlassesLetters: v,
                  bothEyesDistanceWithGlasses: calcSnellen(resultsRef.current.distanceBothGlassesLine, v),
                },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
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
              saveResultPatchAndNavigate({
                sectionType: 'main_test',
                patch: {
                  nearNoGlassesLine: v,
                  nearNoGlasses: calcSnellen(v, '0'),
                },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
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
            title={t('clinical.near_vision')}
            subtitle={t('clinical.glasses_title')}
            question={t('clinical.reading_glasses_q')}
            options={['Yes', 'No']}
            helpConfigId="reading-glasses-question"
            initialValue={results.hasReadingGlasses}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'pretest',
                patch: { hasReadingGlasses: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
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
              saveResultPatchAndNavigate({
                sectionType: 'main_test',
                patch: {
                  nearOwnGlassesLine: v,
                  nearWithGlasses: calcSnellen(v, '0'),
                },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
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
            onNext={(pd) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { pd },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'wheel-right-direction':
        return (
          <WheelDirectionScreen
            side="right"
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelRightDirection}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelRightDirection: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
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
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelRightPower: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'wheel-right-two-colour':
        return (
          <WheelTwoColourScreen
            side="right"
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelRightTwoColour}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelRightTwoColour: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'wheel-right-line-nine':
        return (
          <WheelLine9Screen
            side="right"
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelRightLine9}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelRightLine9: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
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
              const res = resultsRef.current.wheelRightDirection?.startsWith('Neither')
                ? resultsRef.current.wheelRightDirection
                : `${resultsRef.current.wheelRightDirection} ${resultsRef.current.wheelRightPower}`;
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelRightEye: res },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'wheel-right-distance-improved':
        return (
          <WheelDistanceImprovedScreen
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelRightDistanceImproved}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelRightDistanceImproved: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
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
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelRightDistanceLine: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'wheel-right-distance-letters':
        return (
          <VisionLettersScreen
            progress={getProgressForRoute(screen)}
            title="Right distance vision at the wheel"
            initialValue={results.wheelRightDistanceLetters}
            selectedLine={results.wheelRightDistanceLine}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: {
                  wheelRightDistanceLetters: v,
                  wheelRightDistanceSnellen: calcSnellen(resultsRef.current.wheelRightDistanceLine, v),
                },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
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
              const val = resultsRef.current.wheelRightDistanceImproved === 'Yes' ? resultsRef.current.wheelRightDistanceSnellen : 'No';
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelRightDistance: val },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
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
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelLeftDirection: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
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
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelLeftPower: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'wheel-left-two-colour':
        return (
          <WheelTwoColourScreen
            side="left"
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelLeftTwoColour}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelLeftTwoColour: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'wheel-left-line-nine':
        return (
          <WheelLine9Screen
            side="left"
            progress={getProgressForRoute(screen)}
            initialValue={results.wheelLeftLine9}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelLeftLine9: v },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
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
              const res = resultsRef.current.wheelLeftDirection?.startsWith('Neither')
                ? resultsRef.current.wheelLeftDirection
                : `${resultsRef.current.wheelLeftDirection} ${resultsRef.current.wheelLeftPower}`;
              saveResultPatchAndNavigate({
                sectionType: 'post_test',
                patch: { wheelLeftEye: res },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'distance-glasses-dispensed':
        return (
          <DistanceGlassesDispensedScreen
            progress={getProgressForRoute(screen)}
            initialValues={{
              frameType: results.distanceGlassesFrameType,
              frontColour: results.distanceGlassesFrontColour,
              rightArmColour: results.distanceGlassesRightArmColour,
              leftArmColour: results.distanceGlassesLeftArmColour,
              frameSize: results.distanceGlassesFrameSize,
            }}
            onBack={handleClinicalBack}
            onNext={(d) => {
              saveResultPatchAndNavigate({
                sectionType: 'dispensing',
                patch: {
                  distanceGlassesDispensed: true,
                  distanceGlassesFrameType: d.frameType,
                  distanceGlassesFrontColour: d.frontColour,
                  distanceGlassesRightArmColour: d.rightArmColour,
                  distanceGlassesLeftArmColour: d.leftArmColour,
                  distanceGlassesFrameSize: d.frameSize,
                },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
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
            helpConfigId="sunglasses-question"
            errorText="Select Yes or No before continuing."
            initialValue={results.sunglassesDispensed === true ? 'Yes' : (results.sunglassesDispensed === false ? 'No' : undefined)}
            onBack={handleClinicalBack}
            onNext={(v) => {
              saveResultPatchAndNavigate({
                sectionType: 'dispensing',
                patch: { sunglassesDispensed: v === 'Yes' },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'sunglasses-selection':
        return (
          <SunglassesSelection
            onBack={handleClinicalBack}
            onNext={(t) => {
              saveResultPatchAndNavigate({
                sectionType: 'dispensing',
                patch: { sunglassesType: t },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'dispensed-review':
        return (
          <GlassesDispensedReview
            sunglassesDispensed={!!results.sunglassesDispensed}
            onBack={handleClinicalBack}
            onNext={(price) => {
              saveResultPatchAndNavigate({
                sectionType: 'completion',
                patch: { totalPaid: price },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'final-checklist':
        return (
          <FinalChecklist
            onBack={handleClinicalBack}
            onNext={(state) => {
              saveResultPatchAndNavigate({
                sectionType: 'completion',
                patch: { finalChecklist: state },
                nextScreen: getNextClinicalRoute(screen, resultsRef.current),
              });
            }}
          />
        );

      case 'additional-details':
        return (
          <AdditionalDetails
            onBack={handleClinicalBack}
            onSubmit={async (d) => {
              const updatedResults = { ...resultsRef.current, additionalDetails: d };
              resultsRef.current = updatedResults;
              setResults(updatedResults);
              
              if (activeSession && completionService) {
                try {
                  let finalClientId = activeSession.clientId;
                  if (pendingClientDraft && clientRepo) {
                    const newClient = await clientRepo.create(pendingClientDraft);
                    finalClientId = newClient.localId;
                    setPendingClientDraft(null);
                  }

                  await completionService.completeTest(
                    activeSession.localId,
                    [{ type: 'completion', payload: { ...updatedResults, additionalDetails: d } }],
                    finalClientId
                  );

                  await refreshSession();
                  setResults({});
                  resultsRef.current = {};
                  setScreen('test-saved');
                } catch (err) {
                  console.error('Failed to complete test:', err);
                  setSaveError('Failed to save test completion to local database. Please try again.');
                }
              }
            }}
          />
        );

      case 'test-saved':
        return (
          <TestResultsSaved
            onHome={async () => {
              setClient(null);
              setResults({});
              resultsRef.current = {};
              await refreshSession();
              nav('home');
            }}
          />
        );

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
        return <Profile onNav={nav} />;

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
            onStartNewTest={async () => {
              if (!tester || !clientRepo || !workflowService) return;
              try {
                let targetClientId = viewingClient.localId;
                if (!targetClientId && clientRepo) {
                  const existing = await clientRepo.findByOoxiiId(viewingClient.clientId);
                  if (existing) {
                    targetClientId = existing.localId;
                  }
                }

                if (!targetClientId) {
                  targetClientId = `draft_${viewingClient.clientId}_${Date.now()}`;
                  setPendingClientDraft({
                    ooxiiClientId: viewingClient.clientId,
                    yearOfBirth: Number(viewingClient.yearOfBirth) || 0,
                    gender: viewingClient.gender,
                    cataractSurgery: viewingClient.cataractSurgery,
                    country: tester.country,
                    stateProvince: tester.stateProvince,
                    city: tester.city,
                    createdByTesterId: tester.localId,
                  });
                } else {
                  setPendingClientDraft(null);
                }

                await workflowService.startNewTest(tester.localId, targetClientId);
                setClient({ localId: targetClientId, ooxiiId: viewingClient.clientId, yearOfBirth: String(viewingClient.yearOfBirth), gender: viewingClient.gender, cataract: viewingClient.cataractSurgery });
                setResults({});
                await refreshSession();
                nav('glasses-question');
              } catch (err) {
                console.error('Failed to start new test:', err);
              }
            }}
          />
        );

      case 'client-prescription':
        if (!viewingClient) { setScreen('find-client'); return <div />; }
        return <ClientGlassesPrescription client={viewingClient} onBack={() => setScreen('client-profile')} />;

      default:
        return <Login onLoginSuccess={() => setScreen('home')} onCreateAccount={() => setScreen('signup-email')} />;
    }
  }
}
