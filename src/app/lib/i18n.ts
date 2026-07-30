export type LanguageCode = 'en' | 'es';

export const LANGUAGES: Record<LanguageCode, string> = {
  en: 'English',
  es: 'Español',
};

// Stable clinical & UI translation keys
export type TranslationKey =
  // Common UI
  | 'ui.next'
  | 'ui.back'
  | 'ui.save'
  | 'ui.cancel'
  | 'ui.home'
  | 'ui.garden'
  | 'ui.profile'
  | 'ui.settings'
  | 'ui.edit'
  | 'ui.search'
  | 'ui.close'
  | 'ui.help'
  | 'ui.yes'
  | 'ui.no'
  | 'ui.none'
  | 'ui.other'
  | 'ui.male'
  | 'ui.female'
  | 'ui.non_binary'
  | 'ui.prefer_not_to_say'
  | 'ui.online'
  | 'ui.offline_mode'
  | 'ui.overall_progress'
  | 'ui.cancel_test'
  | 'ui.cancel_test_title'
  | 'ui.cancel_test_body'
  | 'ui.keep_testing'
  | 'ui.language'
  | 'ui.display_mode'
  | 'ui.theme_ooxii'
  | 'ui.theme_light'
  | 'ui.select_language'
  | 'ui.view_full_chart'
  | 'ui.focused_view'
  | 'ui.tester_instructions'
  | 'ui.got_it'
  | 'ui.resume'
  | 'ui.total'

  // Auth & Account
  | 'auth.welcome_back'
  | 'auth.link_profile'
  | 'auth.login_subtitle'
  | 'auth.link_subtitle'
  | 'auth.email'
  | 'auth.password'
  | 'auth.confirm_password'
  | 'auth.should_include'
  | 'auth.rule_min_8'
  | 'auth.rule_uppercase'
  | 'auth.rule_special'
  | 'auth.already_registered'
  | 'auth.login_to_account'
  | 'auth.tester_info_title'
  | 'auth.clinic_details'
  | 'auth.select_country'
  | 'auth.select_state'
  | 'auth.select_city'
  | 'auth.additional_info_title'
  | 'auth.health_role'
  | 'auth.select_role'
  | 'auth.experience_level'
  | 'auth.select_experience'
  | 'auth.email_placeholder'
  | 'auth.password_placeholder'
  | 'auth.log_in'
  | 'auth.create_login_link'
  | 'auth.authenticating'
  | 'auth.dont_have_account'
  | 'auth.create_account'
  | 'auth.legacy_found_title'
  | 'auth.legacy_found_body'
  | 'auth.link_account_arrow'
  | 'auth.err_email_invalid'
  | 'auth.err_pw_required'
  | 'auth.err_auth_failed'
  | 'auth.sign_up_title'
  | 'auth.sign_up_subtitle'
  | 'auth.first_name'
  | 'auth.last_name'
  | 'auth.role'
  | 'auth.organization'
  | 'auth.phone'
  | 'auth.country'
  | 'auth.state'
  | 'auth.city'
  | 'auth.sign_up_btn'

  // Home & Region
  | 'home.welcome'
  | 'home.hero_title_1'
  | 'home.hero_title_2'
  | 'home.hero_subtitle'
  | 'home.bun_intro_title'
  | 'home.bun_intro_body'
  | 'home.test_in_progress'
  | 'home.new_client_title'
  | 'home.new_client_body'
  | 'home.new_client_cta'
  | 'home.search_client_title'
  | 'home.search_client_body'
  | 'home.search_client_cta'
  | 'home.confirm_region_title'
  | 'home.tester_region'
  | 'home.tester_region_sub'
  | 'home.other_region'
  | 'home.other_region_sub'
  | 'home.current_tester_region'
  | 'home.optional_village'

  // Clients & Profiles
  | 'clients.find_title'
  | 'clients.search_placeholder'
  | 'clients.count'
  | 'clients.tester_label'
  | 'clients.client_id'
  | 'clients.client_info_title'
  | 'clients.anonymous_notice'
  | 'clients.select_gender'
  | 'clients.year_placeholder'
  | 'clients.cataract_surgery'
  | 'clients.cataract_surgery_question'
  | 'clients.cataract_surgery_sub'
  | 'clients.yes_right_eye'
  | 'clients.yes_left_eye'
  | 'clients.yes_both_eyes'
  | 'clients.start_test'
  | 'clients.profile_title'
  | 'clients.personal_info'
  | 'clients.gender'
  | 'clients.year_of_birth'
  | 'clients.region'
  | 'clients.test_sessions'
  | 'clients.created'
  | 'clients.completed'
  | 'clients.vision_testing'
  | 'clients.glasses_prescription'
  | 'clients.back_to_clients'
  | 'clients.back_to_profile'
  | 'clients.start_new_test'
  | 'clients.vision_review_subtitle'
  | 'clients.prescription_subtitle'
  | 'clients.distance_glasses_dispensed'
  | 'clients.reading_glasses_dispensed'
  | 'clients.sunglasses_dispensed'
  | 'clients.distance_prescription'
  | 'clients.near_prescription'
  | 'clients.wheel_test_badge'
  | 'clients.paddle_test_badge'
  | 'clients.dispensed_badge'
  | 'clients.ophthalmologist'
  | 'clients.paediatrician'
  | 'clients.right_eye'
  | 'clients.left_eye'
  | 'clients.sphere'
  | 'clients.cylinder'
  | 'clients.axis'
  | 'clients.frames'
  | 'clients.frame_type'
  | 'clients.front_colour'
  | 'clients.right_arm'
  | 'clients.left_arm'
  | 'clients.frame_size'

  // Clinical Workflow & Questions
  | 'clinical.phase.pretest'
  | 'clinical.phase.main'
  | 'clinical.phase.posttest'
  | 'clinical.phase.dispensing'
  | 'clinical.eye.right'
  | 'clinical.eye.left'
  | 'clinical.eye.both'
  | 'clinical.distance_vision'
  | 'clinical.near_vision'
  | 'clinical.glasses_title'
  | 'clinical.distance_glasses_q'
  | 'clinical.distance_glasses_sub'
  | 'clinical.reading_glasses_q'
  | 'clinical.reading_glasses_sub'
  | 'clinical.sunglasses_dispensed_q'
  | 'clinical.sunglasses_dispensed_sub'
  | 'clinical.sunglasses_model_q'
  | 'clinical.sunglasses_model_sub'

  // Visual Acuity & Wheel Test Screens
  | 'vision.line_selection_title'
  | 'vision.line_selection_sub'
  | 'vision.line_selection_question'
  | 'vision.letters_correct_title'
  | 'vision.letters_correct_sub'
  | 'vision.letters_correct_question'
  | 'vision.result_title'
  | 'vision.result_score_label'
  | 'wheel.pd_title'
  | 'wheel.pd_sub'
  | 'wheel.pd_question'
  | 'wheel.pd_helper'
  | 'wheel.direction_title'
  | 'wheel.direction_sub'
  | 'wheel.direction_question'
  | 'wheel.power_title'
  | 'wheel.power_sub'
  | 'wheel.power_question'
  | 'wheel.twocolour_title'
  | 'wheel.twocolour_sub'
  | 'wheel.twocolour_question'
  | 'wheel.line9_title'
  | 'wheel.line9_sub'
  | 'wheel.line9_question'
  | 'wheel.distance_improved_title'
  | 'wheel.distance_improved_sub'
  | 'wheel.distance_improved_question'
  | 'wheel.result_title'
  | 'wheel.result_power_label'
  | 'wheel.plus'
  | 'wheel.minus'
  | 'wheel.neither'
  | 'wheel.red'
  | 'wheel.green'
  | 'wheel.equal'

  // Summary & End of Flow
  | 'summary.final_title'
  | 'summary.dispensed_review'
  | 'summary.amount_paid_label'
  | 'summary.end_title'
  | 'summary.end_subtitle'
  | 'summary.finish_cta'
  | 'summary.carrot_earned'

  // Garden & Profile Screen
  | 'garden.title'
  | 'garden.my_plot'
  | 'garden.community_plot'
  | 'garden.carrots_earned'
  | 'garden.badges_earned'
  | 'profile.title'
  | 'profile.tester_profile_subtitle'
  | 'profile.tester_details'
  | 'profile.total_carrots'
  | 'profile.clients_tested'
  | 'profile.badges_earned'
  | 'profile.next_badge'
  | 'profile.more_to_unlock'
  | 'profile.badge_collection'
  | 'profile.view_all'
  | 'profile.all_badges'
  | 'profile.earned'
  | 'profile.unlock_condition'
  | 'profile.logout_confirm_body'
  | 'profile.edit_profile'
  | 'profile.logout'
  | 'profile.tests_completed'
  | 'badge.first_vision.name'
  | 'badge.first_vision.desc'
  | 'badge.ten_helpers.name'
  | 'badge.ten_helpers.desc'
  | 'badge.vision_guide.name'
  | 'badge.vision_guide.desc'
  | 'badge.community_pillar.name'
  | 'badge.community_pillar.desc'
  | 'badge.field_champion.name'
  | 'badge.field_champion.desc'
  | 'badge.vision_legend.name'
  | 'badge.vision_legend.desc'
  | 'badge.rule.completed_tests'
  | 'badge.rule.clients_helped'
  | 'badge.rule.distinct_testing_days'
  | 'badge.rule.carrots_earned'

  // Mascot & Validation Messages
  | 'mascot.error_generic'
  | 'mascot.success_generic'
  | 'mascot.default_generic'
  | 'error.required'
  | 'error.invalid_pd'
  | 'error.select_option';

type Dictionary = Record<TranslationKey, string>;

const en: Dictionary = {
  // Common UI
  'ui.next': 'Next',
  'ui.back': 'Back',
  'ui.save': 'Save',
  'ui.cancel': 'Cancel',
  'ui.home': 'Home',
  'ui.garden': 'Garden',
  'ui.profile': 'Profile',
  'ui.settings': 'Settings',
  'ui.edit': 'Edit',
  'ui.search': 'Search',
  'ui.close': 'Close',
  'ui.help': 'Help',
  'ui.yes': 'Yes',
  'ui.no': 'No',
  'ui.none': 'None',
  'ui.other': 'Other',
  'ui.male': 'Male',
  'ui.female': 'Female',
  'ui.non_binary': 'Non-binary',
  'ui.prefer_not_to_say': 'Prefer not to say',
  'ui.online': 'Online',
  'ui.offline_mode': 'Offline mode',
  'ui.overall_progress': 'Overall Progress',
  'ui.cancel_test': 'Cancel Test',
  'ui.cancel_test_title': 'Cancel Test Session?',
  'ui.cancel_test_body': 'Are you sure you want to cancel this in-progress test? All unsaved test data for this session will be discarded.',
  'ui.keep_testing': 'Keep Testing',
  'ui.language': 'Language',
  'ui.display_mode': 'Display Mode',
  'ui.theme_ooxii': 'OOXii Default',
  'ui.theme_light': 'Light Mode',
  'ui.select_language': 'Select language',
  'ui.view_full_chart': 'View full chart',
  'ui.focused_view': 'Focused view',
  'ui.tester_instructions': 'Tester Instructions',
  'ui.got_it': 'Got it',
  'ui.resume': 'Resume',
  'ui.total': 'Total',

  // Auth & Account
  'auth.welcome_back': 'Welcome back',
  'auth.link_profile': 'Link Your Profile',
  'auth.login_subtitle': 'Log in to continue helping clients see better.',
  'auth.link_subtitle': 'Create email & password login credentials for your existing tester profile.',
  'auth.email': 'Your email',
  'auth.password': 'Password',
  'auth.confirm_password': 'Confirm password',
  'auth.should_include': 'It should include:',
  'auth.rule_min_8': 'At least 8 characters',
  'auth.rule_uppercase': 'At least 1 uppercase letter (A–Z)',
  'auth.rule_special': 'At least 1 special character (e.g. !@#$)',
  'auth.already_registered': 'Already registered?',
  'auth.login_to_account': 'Login to your account',
  'auth.tester_info_title': 'Tester information',
  'auth.clinic_details': 'Clinic details',
  'auth.select_country': 'Select country',
  'auth.select_state': 'Select state / province',
  'auth.select_city': 'Select city',
  'auth.additional_info_title': 'Additional information',
  'auth.health_role': 'Health care role',
  'auth.select_role': 'Select role',
  'auth.experience_level': 'Level of experience',
  'auth.select_experience': 'Select experience',
  'auth.email_placeholder': 'you@example.com',
  'auth.password_placeholder': 'Enter your password',
  'auth.log_in': 'Log in',
  'auth.create_login_link': 'Create Login & Link',
  'auth.authenticating': 'Authenticating...',
  'auth.dont_have_account': "Don't have an account?",
  'auth.create_account': 'Create an account',
  'auth.legacy_found_title': 'Existing Tester Profile Found',
  'auth.legacy_found_body': 'We found existing tester profile(s) on this device without a password. Choose your profile to create login credentials:',
  'auth.link_account_arrow': 'Link account →',
  'auth.err_email_invalid': 'Enter a valid email address.',
  'auth.err_pw_required': 'Enter your password.',
  'auth.err_auth_failed': 'Incorrect email or password',
  'auth.sign_up_title': 'Create an account',
  'auth.sign_up_subtitle': 'Register as a community vision tester to begin.',
  'auth.first_name': 'First name',
  'auth.last_name': 'Last name',
  'auth.role': 'Role / Position',
  'auth.organization': 'Organization',
  'auth.phone': 'Phone number',
  'auth.country': 'Country',
  'auth.state': 'State / Province',
  'auth.city': 'City / Town',
  'auth.sign_up_btn': 'Create account',

  // Home & Region
  'home.welcome': 'Welcome {name}',
  'home.hero_title_1': 'Vision Testing',
  'home.hero_title_2': 'Field App',
  'home.hero_subtitle': 'A guided, step-by-step tool for community vision testers. Bun the rabbit will guide you through every screen.',
  'home.bun_intro_title': "Hi! I'm Bun, your testing guide.",
  'home.bun_intro_body': 'I will point to the next field, remind you when you need help, and celebrate every completed client test with a carrot.',
  'home.test_in_progress': 'Test in progress',
  'home.new_client_title': 'New Client',
  'home.new_client_body': 'Conduct a test for a new client and set up their profile.',
  'home.new_client_cta': 'Start new test',
  'home.search_client_title': 'Search Client Info',
  'home.search_client_body': 'Find a client using their OOXii ID and review saved test information.',
  'home.search_client_cta': 'Search client',
  'home.confirm_region_title': 'Confirm your region',
  'home.tester_region': 'Tester Region',
  'home.tester_region_sub': 'Use the region set on your profile',
  'home.other_region': 'Other Region',
  'home.other_region_sub': 'Choose manually for outreach visits',
  'home.current_tester_region': 'Current tester region',
  'home.optional_village': 'Optional village / site name',

  // Clients & Profiles
  'clients.find_title': 'Find a client',
  'clients.search_placeholder': 'Quick search for a client',
  'clients.count': '{count} clients',
  'clients.tester_label': 'Tester: {name}',
  'clients.client_id': 'Client ID: {id}',
  'clients.client_info_title': 'Client information',
  'clients.anonymous_notice': 'Anonymous — no personal data stored',
  'clients.select_gender': 'Select gender',
  'clients.year_placeholder': 'e.g. 1978',
  'clients.cataract_surgery': 'Cataract surgery: {status}',
  'clients.cataract_surgery_question': 'Have you had cataract surgery before?',
  'clients.cataract_surgery_sub': 'Client cataract surgery history',
  'clients.yes_right_eye': 'Yes, right eye',
  'clients.yes_left_eye': 'Yes, left eye',
  'clients.yes_both_eyes': 'Yes, both eyes',
  'clients.start_test': 'Start test',
  'clients.profile_title': 'Client profile',
  'clients.personal_info': 'Personal information',
  'clients.gender': 'Gender',
  'clients.year_of_birth': 'Year of birth',
  'clients.region': 'Region',
  'clients.test_sessions': 'Test sessions',
  'clients.created': 'Created: {date}',
  'clients.completed': 'Completed: {date}',
  'clients.vision_testing': 'Vision testing',
  'clients.glasses_prescription': 'Glasses prescription',
  'clients.back_to_clients': 'Back to clients',
  'clients.back_to_profile': 'Back to profile',
  'clients.start_new_test': 'Start new test',
  'clients.vision_review_subtitle': 'Completed vision testing runs for this client. Review the dispensed products for each saved session.',
  'clients.prescription_subtitle': 'Distance and near vision prescriptions derived from completed test sessions.',
  'clients.distance_glasses_dispensed': 'Distance Glasses Dispensed',
  'clients.reading_glasses_dispensed': 'Reading Glasses Dispensed',
  'clients.sunglasses_dispensed': 'Sunglasses Dispensed',
  'clients.distance_prescription': 'Distance vision prescription',
  'clients.near_prescription': 'Near vision (reading addition)',
  'clients.wheel_test_badge': 'Wheel Test',
  'clients.paddle_test_badge': 'Paddle Test',
  'clients.dispensed_badge': 'Dispensed',
  'clients.ophthalmologist': 'Ophthalmologist',
  'clients.paediatrician': 'Paediatrician',
  'clients.right_eye': 'Right eye',
  'clients.left_eye': 'Left eye',
  'clients.sphere': 'Sphere',
  'clients.cylinder': 'Cylinder',
  'clients.axis': 'Axis',
  'clients.frames': 'Frames',
  'clients.frame_type': 'Frame type',
  'clients.front_colour': 'Front colour',
  'clients.right_arm': 'Right arm',
  'clients.left_arm': 'Left arm',
  'clients.frame_size': 'Frame size',

  // Clinical Workflow & Questions
  'clinical.phase.pretest': 'Pre-test',
  'clinical.phase.main': 'Main test',
  'clinical.phase.posttest': 'Post-test',
  'clinical.phase.dispensing': 'Dispensing',
  'clinical.eye.right': 'Right eye',
  'clinical.eye.left': 'Left eye',
  'clinical.eye.both': 'Both eyes',
  'clinical.distance_vision': 'Distance vision',
  'clinical.near_vision': 'Near vision',
  'clinical.glasses_title': 'Glasses',
  'clinical.distance_glasses_q': 'Does the client currently have a pair of distance glasses?',
  'clinical.distance_glasses_sub': 'Existing distance eyewear inspection',
  'clinical.reading_glasses_q': 'Do you currently use reading glasses for close work?',
  'clinical.reading_glasses_sub': 'Existing near vision eyewear inspection',
  'clinical.sunglasses_dispensed_q': 'Were UV sunglasses dispensed to the client?',
  'clinical.sunglasses_dispensed_sub': 'Sun protection dispensing verification',
  'clinical.sunglasses_model_q': 'Which sunglasses model was selected?',
  'clinical.sunglasses_model_sub': 'Dispensed sunglasses specification',

  // Visual Acuity & Wheel Test Screens
  'vision.line_selection_title': 'Smallest Line Read',
  'vision.line_selection_sub': 'Distance visual acuity testing',
  'vision.line_selection_question': 'Select the smallest Tumbling E line the client read completely correctly.',
  'vision.letters_correct_title': 'Letters Correct on Next Line',
  'vision.letters_correct_sub': 'Line completion verification',
  'vision.letters_correct_question': 'How many symbols were identified correctly on the next line down?',
  'vision.result_title': 'Distance Vision Acuity Score',
  'vision.result_score_label': 'Visual Acuity Fraction',
  'wheel.pd_title': 'Pupillary Distance (PD)',
  'wheel.pd_sub': 'Wheel apparatus alignment',
  'wheel.pd_question': 'Align viewfinders and read the PD value (mm) from the central scale.',
  'wheel.pd_helper': 'Enter a value between 52 and 78 mm',
  'wheel.direction_title': 'Lens Direction',
  'wheel.direction_sub': 'Plus / Minus clarity comparison',
  'wheel.direction_question': 'Which lens direction makes the chart clearer for the client?',
  'wheel.power_title': 'Lens Power Selection',
  'wheel.power_sub': 'Power dial adjustment',
  'wheel.power_question': 'Select the lowest power strength providing maximum chart clarity.',
  'wheel.twocolour_title': 'Two-Colour Duochrome Test',
  'wheel.twocolour_sub': 'Red / Green contrast balance',
  'wheel.twocolour_question': 'Are the letters sharper on the RED side, GREEN side, or EQUAL?',
  'wheel.line9_title': 'Line 9 Verification',
  'wheel.line9_sub': 'Corrected acuity check',
  'wheel.line9_question': 'Can the client comfortably read Line 9 with corrected lenses?',
  'wheel.distance_improved_title': 'Distance Vision Improvement',
  'wheel.distance_improved_sub': '3m clarity confirmation',
  'wheel.distance_improved_question': 'Did distance vision improve compared to uncorrected testing?',
  'wheel.result_title': 'Wheel Refraction Result',
  'wheel.result_power_label': 'Final Prescribed Lens Power',
  'wheel.plus': 'Plus (+)',
  'wheel.minus': 'Minus (-)',
  'wheel.neither': 'Neither / Equal',
  'wheel.red': 'Red',
  'wheel.green': 'Green',
  'wheel.equal': 'Equal / Same',

  // Summary & End of Flow
  'summary.final_title': 'Final Testing Summary',
  'summary.dispensed_review': 'Eyewear Dispensed Review',
  'summary.amount_paid_label': 'Total Amount Paid (Local Currency)',
  'summary.end_title': 'Testing Complete!',
  'summary.end_subtitle': 'Great job! The test data has been saved to the local offline database.',
  'summary.finish_cta': 'Return to Home',
  'summary.carrot_earned': '+1 Carrot Earned!',

  // Garden & Profile Screen
  'garden.title': 'Garden',
  'garden.my_plot': 'My Plot',
  'garden.community_plot': 'Community Plot',
  'garden.carrots_earned': 'Carrots Earned',
  'garden.badges_earned': 'Badges Earned',
  'profile.title': 'Tester Profile',
  'profile.tester_profile_subtitle': 'TESTER PROFILE',
  'profile.tester_details': 'Tester Details',
  'profile.total_carrots': 'Total carrots collected',
  'profile.clients_tested': 'Clients tested',
  'profile.badges_earned': 'Badges earned',
  'profile.next_badge': 'Next Badge',
  'profile.more_to_unlock': '{count} more to unlock',
  'profile.badge_collection': 'Badge Collection',
  'profile.view_all': 'View all ({count})',
  'profile.all_badges': 'All Badges ({count})',
  'profile.earned': 'Earned',
  'profile.unlock_condition': 'Unlock Condition',
  'profile.logout_confirm_body': 'Are you sure you want to log out of your account? Your local clinical records and progress will remain saved on this device.',
  'profile.edit_profile': 'Edit Profile',
  'profile.logout': 'Log Out',
  'profile.tests_completed': 'Tests Completed',
  'badge.first_vision.name': 'First Vision',
  'badge.first_vision.desc': 'Complete your first client test',
  'badge.ten_helpers.name': 'Ten Helpers',
  'badge.ten_helpers.desc': 'Complete 10 client tests',
  'badge.vision_guide.name': 'Vision Guide',
  'badge.vision_guide.desc': 'Complete 50 client tests',
  'badge.community_pillar.name': 'Community Pillar',
  'badge.community_pillar.desc': 'Complete 100 client tests',
  'badge.field_champion.name': 'Field Champion',
  'badge.field_champion.desc': 'Complete 200 client tests',
  'badge.vision_legend.name': 'Vision Legend',
  'badge.vision_legend.desc': 'Complete 500 client tests',
  'badge.rule.completed_tests': 'Complete {target} vision tests',
  'badge.rule.clients_helped': 'Help {target} distinct clients',
  'badge.rule.distinct_testing_days': 'Test on {target} different days',
  'badge.rule.carrots_earned': 'Earn {target} carrots',

  // Mascot & Validation Messages
  'mascot.error_generic': 'Finish this field first, then we can move forward.',
  'mascot.success_generic': 'Nice work! Press Next to continue.',
  'mascot.default_generic': "You're here. Complete this step to keep going.",
  'error.required': 'This field is required',
  'error.invalid_pd': 'Enter a PD between 52 and 78',
  'error.select_option': 'Please select an option before continuing.',
};

const es: Dictionary = {
  // Common UI
  'ui.next': 'Siguiente',
  'ui.back': 'Atrás',
  'ui.save': 'Guardar',
  'ui.cancel': 'Cancelar',
  'ui.home': 'Inicio',
  'ui.garden': 'Jardín',
  'ui.profile': 'Perfil',
  'ui.settings': 'Configuración',
  'ui.edit': 'Editar',
  'ui.search': 'Buscar',
  'ui.close': 'Cerrar',
  'ui.help': 'Ayuda',
  'ui.yes': 'Sí',
  'ui.no': 'No',
  'ui.none': 'Ninguno',
  'ui.other': 'Otro',
  'ui.male': 'Masculino',
  'ui.female': 'Femenino',
  'ui.non_binary': 'No binario',
  'ui.prefer_not_to_say': 'Prefiero no decir',
  'ui.online': 'En línea',
  'ui.offline_mode': 'Modo sin conexión',
  'ui.overall_progress': 'PROGRESO GENERAL',
  'ui.cancel_test': 'Cancelar Prueba',
  'ui.cancel_test_title': '¿Cancelar Sesión de Prueba?',
  'ui.cancel_test_body': '¿Está seguro de que desea cancelar esta prueba en curso? Se descartarán todos los datos no guardados.',
  'ui.keep_testing': 'Continuar Prueba',
  'ui.language': 'Idioma',
  'ui.display_mode': 'Modo de Pantalla',
  'ui.theme_ooxii': 'OOXii Predeterminado',
  'ui.theme_light': 'Modo Claro',
  'ui.select_language': 'Seleccionar idioma',
  'ui.view_full_chart': 'Ver tabla completa',
  'ui.focused_view': 'Vista enfocada',
  'ui.tester_instructions': 'Instrucciones para el Examinador',
  'ui.got_it': 'Entendido',
  'ui.resume': 'Reanudar',
  'ui.total': 'Total',

  // Auth & Account
  'auth.welcome_back': 'Bienvenido de nuevo',
  'auth.link_profile': 'Vincular su Perfil',
  'auth.login_subtitle': 'Inicie sesión para continuar ayudando a los pacientes a ver mejor.',
  'auth.link_subtitle': 'Cree credenciales con correo y contraseña para su perfil existente de examinador.',
  'auth.email': 'Su correo electrónico',
  'auth.password': 'Contraseña',
  'auth.confirm_password': 'Confirmar contraseña',
  'auth.should_include': 'Debe incluir:',
  'auth.rule_min_8': 'Al menos 8 caracteres',
  'auth.rule_uppercase': 'Al menos 1 letra mayúscula (A–Z)',
  'auth.rule_special': 'Al menos 1 carácter especial (ej. !@#$)',
  'auth.already_registered': '¿Ya está registrado?',
  'auth.login_to_account': 'Iniciar sesión en su cuenta',
  'auth.tester_info_title': 'Información del examinador',
  'auth.clinic_details': 'Detalles de la clínica',
  'auth.select_country': 'Seleccionar país',
  'auth.select_state': 'Seleccionar estado / provincia',
  'auth.select_city': 'Seleccionar ciudad',
  'auth.additional_info_title': 'Información adicional',
  'auth.health_role': 'Cargo de atención médica',
  'auth.select_role': 'Seleccionar cargo',
  'auth.experience_level': 'Nivel de experiencia',
  'auth.select_experience': 'Seleccionar experiencia',
  'auth.email_placeholder': 'usted@ejemplo.com',
  'auth.password_placeholder': 'Ingrese su contraseña',
  'auth.log_in': 'Iniciar sesión',
  'auth.create_login_link': 'Crear Acceso y Vincular',
  'auth.authenticating': 'Autenticando...',
  'auth.dont_have_account': '¿No tiene una cuenta?',
  'auth.create_account': 'Crear una cuenta',
  'auth.legacy_found_title': 'Perfil de Examinador Existente Encontrado',
  'auth.legacy_found_body': 'Encontramos perfiles de examinador en este dispositivo sin contraseña. Elija su perfil para crear credenciales de acceso:',
  'auth.link_account_arrow': 'Vincular cuenta →',
  'auth.err_email_invalid': 'Ingrese un correo electrónico válido.',
  'auth.err_pw_required': 'Ingrese su contraseña.',
  'auth.err_auth_failed': 'Correo electrónico o contraseña incorrectos',
  'auth.sign_up_title': 'Crear una cuenta',
  'auth.sign_up_subtitle': 'Regístrese como examinador visual comunitario para comenzar.',
  'auth.first_name': 'Nombre',
  'auth.last_name': 'Apellido',
  'auth.role': 'Cargo / Función',
  'auth.organization': 'Organización',
  'auth.phone': 'Número de teléfono',
  'auth.country': 'País',
  'auth.state': 'Estado / Provincia',
  'auth.city': 'Ciudad / Pueblo',
  'auth.sign_up_btn': 'Crear cuenta',

  // Home & Region
  'home.welcome': 'Bienvenido {name}',
  'home.hero_title_1': 'Evaluación Visual',
  'home.hero_title_2': 'App de Campo',
  'home.hero_subtitle': 'Una herramienta guiada paso a paso para examinadores de visión comunitarios. Bun el conejo le guiará en cada pantalla.',
  'home.bun_intro_title': '¡Hola! Soy Bun, su guía de evaluación.',
  'home.bun_intro_body': 'Le señalaré el siguiente campo, le recordaré cuando necesite ayuda y celebraré cada prueba completada con una zanahoria.',
  'home.test_in_progress': 'Prueba en curso',
  'home.new_client_title': 'Nuevo Paciente',
  'home.new_client_body': 'Realice una prueba para un nuevo paciente y configure su perfil.',
  'home.new_client_cta': 'Iniciar nueva prueba',
  'home.search_client_title': 'Buscar Información de Paciente',
  'home.search_client_body': 'Encuentre un paciente usando su ID de OOXii y revise la información de pruebas guardadas.',
  'home.search_client_cta': 'Buscar paciente',
  'home.confirm_region_title': 'Confirme su región',
  'home.tester_region': 'Región del Examinador',
  'home.tester_region_sub': 'Usar la región configurada en su perfil',
  'home.other_region': 'Otra Región',
  'home.other_region_sub': 'Seleccionar manualmente para visitas de campo',
  'home.current_tester_region': 'Región actual del examinador',
  'home.optional_village': 'Poblado o sitio opcional',

  // Clients & Profiles
  'clients.find_title': 'Buscar un paciente',
  'clients.search_placeholder': 'Búsqueda rápida de paciente',
  'clients.count': '{count} pacientes',
  'clients.tester_label': 'Examinador: {name}',
  'clients.client_id': 'ID de Paciente: {id}',
  'clients.client_info_title': 'Información del paciente',
  'clients.anonymous_notice': 'Anónimo — sin datos personales guardados',
  'clients.select_gender': 'Seleccionar género',
  'clients.year_placeholder': 'ej. 1978',
  'clients.cataract_surgery': 'Cirugía de catarata: {status}',
  'clients.cataract_surgery_question': '¿Se ha realizado cirugía de cataratas antes?',
  'clients.cataract_surgery_sub': 'Historial de cirugía de cataratas del paciente',
  'clients.yes_right_eye': 'Sí, ojo derecho',
  'clients.yes_left_eye': 'Sí, ojo izquierdo',
  'clients.yes_both_eyes': 'Sí, ambos ojos',
  'clients.start_test': 'Iniciar prueba',
  'clients.profile_title': 'Perfil del paciente',
  'clients.personal_info': 'Información personal',
  'clients.gender': 'Género',
  'clients.year_of_birth': 'Año de nacimiento',
  'clients.region': 'Región',
  'clients.test_sessions': 'Sesiones de prueba',
  'clients.created': 'Creado: {date}',
  'clients.completed': 'Completado: {date}',
  'clients.vision_testing': 'Prueba de visión',
  'clients.glasses_prescription': 'Receta de anteojos',
  'clients.back_to_clients': 'Volver a pacientes',
  'clients.back_to_profile': 'Volver al perfil',
  'clients.start_new_test': 'Iniciar nueva prueba',
  'clients.vision_review_subtitle': 'Evaluaciones visuales completadas para este paciente. Revise los productos entregados en cada sesión guardada.',
  'clients.prescription_subtitle': 'Recetas para visión lejana y cercana derivadas de las sesiones de prueba completadas.',
  'clients.distance_glasses_dispensed': 'Anteojos de Lejos Entregados',
  'clients.reading_glasses_dispensed': 'Anteojos de Cerca Entregados',
  'clients.sunglasses_dispensed': 'Anteojos de Sol Entregados',
  'clients.distance_prescription': 'Receta de visión lejana',
  'clients.near_prescription': 'Visión cercana (adición de lectura)',
  'clients.wheel_test_badge': 'Prueba del Disco',
  'clients.paddle_test_badge': 'Prueba de Paleta',
  'clients.dispensed_badge': 'Entregado',
  'clients.ophthalmologist': 'Oftalmólogo',
  'clients.paediatrician': 'Pediatra',
  'clients.right_eye': 'Ojo derecho',
  'clients.left_eye': 'Ojo izquierdo',
  'clients.sphere': 'Esfera',
  'clients.cylinder': 'Cilindro',
  'clients.axis': 'Eje',
  'clients.frames': 'Monturas',
  'clients.frame_type': 'Tipo de montura',
  'clients.front_colour': 'Color frontal',
  'clients.right_arm': 'Patilla derecha',
  'clients.left_arm': 'Patilla izquierda',
  'clients.frame_size': 'Tamaño de montura',

  // Clinical Workflow & Questions
  'clinical.phase.pretest': 'Pre-evaluación',
  'clinical.phase.main': 'Prueba principal',
  'clinical.phase.posttest': 'Post-evaluación',
  'clinical.phase.dispensing': 'Entrega',
  'clinical.eye.right': 'Ojo derecho',
  'clinical.eye.left': 'Ojo izquierdo',
  'clinical.eye.both': 'Ambos ojos',
  'clinical.distance_vision': 'Visión lejana',
  'clinical.near_vision': 'Visión cercana',
  'clinical.glasses_title': 'Anteojos',
  'clinical.distance_glasses_q': '¿Tiene el paciente actualmente un par de anteojos de lejos?',
  'clinical.distance_glasses_sub': 'Inspección de anteojos de lejos existentes',
  'clinical.reading_glasses_q': '¿Usa actualmente anteojos de lectura para trabajos de cerca?',
  'clinical.reading_glasses_sub': 'Inspección de anteojos de cerca existentes',
  'clinical.sunglasses_dispensed_q': '¿Se entregaron anteojos de sol UV al paciente?',
  'clinical.sunglasses_dispensed_sub': 'Verificación de entrega de protección solar',
  'clinical.sunglasses_model_q': '¿Qué modelo de anteojos de sol se seleccionó?',
  'clinical.sunglasses_model_sub': 'Especificación de anteojos de sol entregados',

  // Visual Acuity & Wheel Test Screens
  'vision.line_selection_title': 'Línea Más Pequeña Leída',
  'vision.line_selection_sub': 'Prueba de agudeza visual lejana',
  'vision.line_selection_question': 'Seleccione la línea más pequeña de la E que el paciente leyó correctamente.',
  'vision.letters_correct_title': 'Letras Correctas en la Siguiente Línea',
  'vision.letters_correct_sub': 'Verificación de finalización de línea',
  'vision.letters_correct_question': '¿Cuántos símbolos identificó correctamente en la siguiente línea inferior?',
  'vision.result_title': 'Puntaje de Agudeza Visual Lejana',
  'vision.result_score_label': 'Fracción de Agudeza Visual',
  'wheel.pd_title': 'Distancia Interpupilar (DIP)',
  'wheel.pd_sub': 'Alineación del aparato del disco',
  'wheel.pd_question': 'Alinee los visores y lea el valor de DIP (mm) en la escala central.',
  'wheel.pd_helper': 'Ingrese un valor entre 52 y 78 mm',
  'wheel.direction_title': 'Dirección del Lente',
  'wheel.direction_sub': 'Comparación de claridad Más / Menos',
  'wheel.direction_question': '¿Qué dirección de lente hace que la tabla sea más clara para el paciente?',
  'wheel.power_title': 'Selección de Potencia del Lente',
  'wheel.power_sub': 'Ajuste del selector de potencia',
  'wheel.power_question': 'Seleccione la potencia más baja que proporcione la máxima claridad.',
  'wheel.twocolour_title': 'Prueba Bicromática (Rojo / Verde)',
  'wheel.twocolour_sub': 'Balance de contraste Rojo / Verde',
  'wheel.twocolour_question': '¿Las letras se ven más nítidas en el lado ROJO, VERDE o IGUAL?',
  'wheel.line9_title': 'Verificación de Línea 9',
  'wheel.line9_sub': 'Comprobación de agudeza corregida',
  'wheel.line9_question': '¿Puede el paciente leer cómodamente la Línea 9 con los lentes corregidos?',
  'wheel.distance_improved_title': 'Mejora en Visión Lejana',
  'wheel.distance_improved_sub': 'Confirmación de claridad a 3m',
  'wheel.distance_improved_question': '¿Mejoró la visión lejana en comparación con la prueba sin corrección?',
  'wheel.result_title': 'Resultado de Refracción del Disco',
  'wheel.result_power_label': 'Potencia de Lente Prescrita Final',
  'wheel.plus': 'Más (+)',
  'wheel.minus': 'Menos (-)',
  'wheel.neither': 'Ninguno / Igual',
  'wheel.red': 'Rojo',
  'wheel.green': 'Verde',
  'wheel.equal': 'Igual / Mismo',

  // Summary & End of Flow
  'summary.final_title': 'Resumen Final de Evaluación',
  'summary.dispensed_review': 'Revisión de Lentes Entregados',
  'summary.amount_paid_label': 'Monto Total Pagado (Moneda Local)',
  'summary.end_title': '¡Evaluación Completada!',
  'summary.end_subtitle': '¡Buen trabajo! Los datos de la prueba se han guardado en la base de datos local.',
  'summary.finish_cta': 'Volver al Inicio',
  'summary.carrot_earned': '¡+1 Zanahoria Ganada!',

  // Garden & Profile Screen
  'garden.title': 'Jardín',
  'garden.my_plot': 'Mi Parcela',
  'garden.community_plot': 'Parcela Comunitaria',
  'garden.carrots_earned': 'Zanahorias Ganadas',
  'garden.badges_earned': 'Insignias Ganadas',
  'profile.title': 'Perfil del Examinador',
  'profile.tester_profile_subtitle': 'PERFIL DEL EXAMINADOR',
  'profile.tester_details': 'Detalles del Examinador',
  'profile.total_carrots': 'Total de zanahorias recolectadas',
  'profile.clients_tested': 'Pacientes evaluados',
  'profile.badges_earned': 'Insignias ganadas',
  'profile.next_badge': 'Siguiente Insignia',
  'profile.more_to_unlock': '{count} más para desbloquear',
  'profile.badge_collection': 'Colección de Insignias',
  'profile.view_all': 'Ver todas ({count})',
  'profile.all_badges': 'Todas las Insignias ({count})',
  'profile.earned': 'Obtenida',
  'profile.unlock_condition': 'Condición de Desbloqueo',
  'profile.logout_confirm_body': '¿Está seguro de que desea cerrar sesión? Sus registros clínicos locales y su progreso permanecerán guardados en este dispositivo.',
  'profile.edit_profile': 'Editar Perfil',
  'profile.logout': 'Cerrar Sesión',
  'profile.tests_completed': 'Pruebas Completadas',
  'badge.first_vision.name': 'Primera Visión',
  'badge.first_vision.desc': 'Complete su primera prueba de paciente',
  'badge.ten_helpers.name': 'Diez Ayudantes',
  'badge.ten_helpers.desc': 'Complete 10 pruebas de paciente',
  'badge.vision_guide.name': 'Guía de Visión',
  'badge.vision_guide.desc': 'Complete 50 pruebas de paciente',
  'badge.community_pillar.name': 'Pilar Comunitario',
  'badge.community_pillar.desc': 'Complete 100 pruebas de paciente',
  'badge.field_champion.name': 'Campeón de Campo',
  'badge.field_champion.desc': 'Complete 200 pruebas de paciente',
  'badge.vision_legend.name': 'Leyenda de la Visión',
  'badge.vision_legend.desc': 'Complete 500 pruebas de paciente',
  'badge.rule.completed_tests': 'Complete {target} pruebas de visión',
  'badge.rule.clients_helped': 'Ayude a {target} pacientes distintos',
  'badge.rule.distinct_testing_days': 'Evalúe en {target} días diferentes',
  'badge.rule.carrots_earned': 'Gane {target} zanahorias',

  // Mascot & Validation Messages
  'mascot.error_generic': 'Complete este campo primero, luego podremos avanzar.',
  'mascot.success_generic': '¡Buen trabajo! Presione Siguiente para continuar.',
  'mascot.default_generic': 'Está aquí. Complete este paso para continuar.',
  'error.required': 'Este campo es obligatorio',
  'error.invalid_pd': 'Ingrese una DIP entre 52 y 78',
  'error.select_option': 'Por favor seleccione una opción antes de continuar.',
};

const DICTIONARIES: Record<LanguageCode, Dictionary> = {
  en,
  es,
};

export function translate(
  lang: LanguageCode,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const dict = DICTIONARIES[lang] || DICTIONARIES['en'];
  let text = dict[key] || DICTIONARIES['en']?.[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    });
  }

  return text;
}
