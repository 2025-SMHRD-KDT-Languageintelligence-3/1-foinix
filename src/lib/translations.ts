
export type Language = 'ko' | 'en';

export const translations: Record<string, Record<Language, string>> = {
  // === Global ===
  "button.languageSwitch": { ko: "Switch to English", en: "한국어로 변경" },
  "button.cancel": { ko: "취소", en: "Cancel" },
  "button.confirm": { ko: "확인", en: "Confirm" },
  "button.agree": { ko: "동의함", en: "I Agree" },
  "button.disagree": { ko: "동의 안 함", en: "I Do Not Agree" },
  "button.skipConsentAndContinue": { ko: "동의 건너뛰고 계속", en: "Skip Consent and Continue" },
  "button.next": { ko: "다음", en: "Next" },
  "button.back": { ko: "뒤로", en: "Back" },
  "button.submit": { ko: "제출", en: "Submit" },
  "button.close": { ko: "닫기", en: "Close" },
  "label.loading": { ko: "로딩 중...", en: "Loading..." },
  "label.pleaseWait": { ko: "잠시만 기다려주십시오...", en: "Please wait a moment..." },
  "error.genericTitle": { ko: "오류", en: "Error" },
  "warning.genericTitle": { ko: "경고", en: "Warning" },

  // === InitialWelcomeScreen ===
  "initialWelcome.title": { ko: "eCharge 키오스크에 오신 것을 환영합니다!", en: "Welcome to eCharge Kiosk!" },
  "initialWelcome.greeting": { ko: "잠시 후 서비스 안내가 시작됩니다.", en: "Service guidance will begin shortly." },
  "initialWelcome.proceedButtonStandard": { ko: "서비스 안내 시작 (일반 모드)", en: "Start Service Guide (Standard Mode)" },
  "initialWelcome.proceedButtonQuick": { ko: "빠른 시작", en: "Quick Start" },
  "initialWelcome.proceedButtonQuickAlt": { ko: "빠른 시작 모드로 전환", en: "Switch to Quick Start Mode" },
  "initialWelcome.autoSwitchMessage": { ko: "또는 10초 후 자동으로 화면이 전환됩니다...", en: "Or the screen will switch automatically after 10 seconds..." },
  
  // === Quick Mode Specific Toasts ===
  "quickMode.consentToast.title": { ko: "빠른 시작 동의 안내", en: "Quick Start Consent Notice" },
  "quickMode.consentToast.description": { ko: "계속 진행하시면 AI 카메라 사용 및 충전 서비스에 필요한 제한된 개인 정보 사용에 동의하는 것으로 간주됩니다. 이 메시지는 잠시 후 자동으로 사라집니다.", en: "By continuing, you agree to the use of AI camera and limited personal data for charging services. This message will auto-dismiss shortly." },
  "quickMode.disagreeWarning.title": { ko: "빠른 시작 주의", en: "Quick Start Notice" },
  "quickMode.disagreeWarning.description": { ko: "빠른 시작 모드는 데이터 수집 동의가 필요합니다. 동의를 건너뛰고 일반 모드로 진행하시려면 '동의 안 함'을 다시 누르세요. 이 경우 차량 정보를 수동으로 입력하게 됩니다.", en: "Quick Start mode requires data consent. To skip consent and proceed in Standard Mode (manual entry), press 'I Do Not Agree' again." },


  // === DataConsentScreen ===
  "dataConsent.title": { ko: "데이터 수집 및 사용 동의", en: "Data Collection and Usage Consent" },
  "dataConsent.p1": { ko: "eCharge 키오스크는 원활한 서비스 제공을 위해 AI 카메라를 사용하여 차량 번호판을 자동으로 인식합니다.", en: "eCharge Kiosk uses an AI camera to automatically recognize vehicle license plates for smooth service provision." },
  "dataConsent.p2": { ko: "서비스 과정에서 필요한 경우, 차량 종류 또는 모바일 번호와 같은 개인 정보를 수집하거나 참조할 수 있습니다.", en: "If necessary for service purposes, personal information such as vehicle type or mobile number may be collected or referenced." },
  "dataConsent.p3": { ko: "수집된 정보는 서비스 제공 목적으로만 사용되며, 관련 법규에 따라 안전하게 관리됩니다.", en: "Collected information is used solely for service provision and is managed securely according to relevant laws and regulations." },
  "dataConsent.p4_agree": { ko: "계속 진행하시려면 아래 '동의함' 버튼을 눌러주십시오.", en: "Please press the 'I Agree' button below to proceed." },
  "dataConsent.warning_disagreeAgain": { ko: "경고: 다시 '동의 안 함'을 누르시면 동의 절차를 건너뛰고 일부 기능이 제한될 수 있습니다. 차량 정보를 수동으로 입력하게 됩니다.", en: "Warning: Pressing 'I Do Not Agree' again will skip the consent process. You will need to enter vehicle information manually." },
  "dataConsent.serviceLimited": { ko: "동의하지 않으시면 키오스크 서비스 이용이 제한될 수 있습니다.", en: "If you do not agree, your use of the kiosk service may be limited." },
  "dataConsent.toast.disagreeWarning.title": { ko: "경고", en: "Warning"},
  "dataConsent.toast.disagreeWarning.description": { ko: "서비스를 이용하시려면 데이터 수집 및 사용에 동의해주셔야 합니다. 동의를 건너뛰려면 '동의 안 함'을 다시 누르세요. 이 경우 차량 정보를 수동으로 입력합니다.", en: "To use the service, you must agree to data collection and usage. Press 'I Do Not Agree' again to skip consent and enter vehicle information manually." },
  "dataConsent.toast.consentSkipped.title": { ko: "동의 건너뜀", en: "Consent Skipped" },
  "dataConsent.toast.consentSkipped.description": { ko: "데이터 수집 동의가 건너뛰어졌습니다. 차량 정보를 수동으로 선택합니다.", en: "Data collection consent has been skipped. You will select vehicle information manually." },

  // === SelectCarBrandScreen ===
  "selectCarBrand.title": { ko: "차량 브랜드 선택", en: "Select Vehicle Brand" },
  "selectCarBrand.instruction": { ko: "차량의 브랜드를 선택해주세요.", en: "Please select your vehicle's brand." },
  "selectCarBrand.button.cancel": { ko: "취소하고 돌아가기", en: "Cancel and Go Back" },
  "selectCarBrand.toast.brandSelected.title": { ko: "브랜드 선택됨", en: "Brand Selected" },
  "selectCarBrand.toast.brandSelected.description": { ko: "{{brandName}} 모델을 선택하세요.", en: "Please select a model for {{brandName}}." },

  "carBrand.hyundai": { ko: "현대", en: "Hyundai" },
  "carBrand.kia": { ko: "기아", en: "Kia" },
  "carBrand.kgm": { ko: "KG 모빌리티", en: "KG Mobility" },
  "carBrand.tesla": { ko: "테슬라", en: "Tesla" },
  "logo": { ko: "로고", en: "logo" },


  // === SelectCarModelScreen ===
  "selectCarModel.title": { ko: "{{brandName}} 모델 선택", en: "Select {{brandName}} Model" },
  "selectCarModel.instruction": { ko: "차량 모델을 선택해주세요.", en: "Please select your vehicle model." },
  "selectCarModel.button.cancel": { ko: "브랜드 선택으로 돌아가기", en: "Back to Brand Selection" },
  "selectCarModel.error.noBrand": { ko: "브랜드 정보 없음", en: "No Brand Information" },
  "selectCarModel.error.noBrandMessage": { ko: "선택된 브랜드 정보를 찾을 수 없습니다.", en: "Could not find information for the selected brand." },
  "selectCarModel.toast.modelSelected.title": { ko: "모델 선택됨", en: "Model Selected" },
  "selectCarModel.toast.modelSelected.description": { ko: "{{modelName}} 선택. 결제 정보를 인증해주세요.", en: "{{modelName}} selected. Please authenticate payment information." },
  "selectCarModel.manualEntryLicensePlate": { ko: "수동입력", en: "Manual Entry" },
  "selectCarModel.unknownModel": { ko: "알 수 없음", en: "Unknown" },
  "selectCarModel.portLocationGeneric": { ko: "차량 설명서 또는 제조사 웹사이트 참조", en: "Refer to vehicle manual or manufacturer website" },

  "carModel.hyundai.ioniq5": { ko: "아이오닉 5", en: "IONIQ 5" },
  "carModel.hyundai.kona_ev": { ko: "코나 일렉트릭", en: "Kona Electric" },
  "carModel.kia.ev6": { ko: "EV6", en: "EV6" },
  "carModel.kia.niro_ev": { ko: "니로 EV", en: "Niro EV" },
  "carModel.kgm.torres_evx": { ko: "토레스 EVX", en: "Torres EVX" },
  "carModel.kgm.korando_emotion": { ko: "코란도 이모션", en: "Korando e-Motion" },
  "carModel.tesla.model_3": { ko: "모델 3", en: "Model 3" },
  "carModel.tesla.model_y": { ko: "모델 Y", en: "Model Y" },

  // === WelcomeScreen (Auto-scan path) ===
  "welcome.title": { ko: "eCharge 키오스크에 오신 것을 환영합니다", en: "Welcome to eCharge Kiosk" },
  "welcome.message": { ko: "차량 정보를 확인하고 사용 가능한 충전 슬롯을 찾는 중입니다...", en: "Identifying your vehicle and finding an available charging slot..." },
  "welcome.quickModeMessage": { ko: "빠른 시작 모드: 차량 정보를 자동으로 처리합니다...", en: "Quick Start Mode: Automatically processing vehicle information..." },

  // === VehicleConfirmationScreen ===
  "vehicleConfirmation.title": { ko: "차량 확인됨!", en: "Vehicle Confirmed!" },
  "vehicleConfirmation.manualEntryTitle": { ko: "차량 번호판 입력", en: "Enter License Plate" },
  "vehicleConfirmation.question": { ko: "이 차량이 맞습니까?", en: "Is this your vehicle?" },
  "vehicleConfirmation.label.model": { ko: "모델", en: "Model" },
  "vehicleConfirmation.label.confidence": { ko: "인식 신뢰도", en: "Recognition Confidence" },
  "vehicleConfirmation.button.confirm": { ko: "예, 차량 확인", en: "Yes, Confirm Vehicle" },
  "vehicleConfirmation.button.manualEntry": { ko: "아니요 / 직접 입력", en: "No / Enter Manually" },
  "vehicleConfirmation.placeholder.plate": { ko: "예: 12가1234", en: "e.g., 12GA1234" },
  "vehicleConfirmation.button.submitPlate": { ko: "번호판 제출", en: "Submit Plate" },
  "vehicleConfirmation.button.backToScan": { ko: "스캔 결과로 돌아가기", en: "Back to Scan Results" },
  "vehicleConfirmation.quickModeAutoConfirm": { ko: "빠른 시작 모드: 차량 정보가 자동 확인되었습니다.", en: "Quick Start Mode: Vehicle information auto-confirmed." },


  // === PrePaymentAuthScreen ===
  "prePaymentAuth.title": { ko: "결제 인증", en: "Payment Authorization" },
  "prePaymentAuth.instruction": { ko: "결제 방법을 선택하고, 해당 방법으로 인증을 진행해주세요.", en: "Select your payment method and proceed with authorization." },
  "prePaymentAuth.processingTitle": { ko: "결제 승인 중...", en: "Authorizing Payment..." },
  "prePaymentAuth.processingMessage": { ko: "결제 정보를 확인하고 있습니다. 잠시만 기다려주십시오...", en: "Verifying payment information. Please wait a moment..." },
  "prePaymentAuth.processingSecurityCheck": { ko: "보안 연결 확인 중", en: "Checking secure connection" },
  "prePaymentAuth.cardReader.title": { ko: "카드 리더기 사용", en: "Use Card Reader" },
  "prePaymentAuth.cardReader.instruction": { ko: "신용/체크카드 또는 충전 멤버십 카드를 지정된 리더기에 삽입하거나 태그해주세요.", en: "Insert or tap your credit/debit card or charging membership card on the designated reader." },
  "prePaymentAuth.contactless.title": { ko: "비접촉 결제", en: "Contactless Payment" },
  "prePaymentAuth.contactless.instruction": { ko: "스마트폰의 삼성페이, Apple Pay 또는 기타 NFC 지원 결제 앱을 리더기에 태그하세요.", en: "Tap your smartphone with Samsung Pay, Apple Pay, or other NFC-enabled payment apps on the reader." },
  "prePaymentAuth.button.authWithCard": { ko: "카드로 인증 진행", en: "Authorize with Card" },
  "prePaymentAuth.button.authWithNFC": { ko: "NFC/모바일로 인증 진행", en: "Authorize with NFC/Mobile" },
  "prePaymentAuth.toast.success.title": { ko: "결제 승인 성공", en: "Payment Authorized" },
  "prePaymentAuth.toast.success.description_select_connector": { ko: "결제 수단이 성공적으로 승인되었습니다. 충전 커넥터 유형을 선택해주세요.", en: "Payment method successfully authorized. Please select a charging connector type." },

  // === InitialPromptConnectScreen ===
  "initialPromptConnect.title": { ko: "{{slotNumber}}번 슬롯에 충전기를 연결하세요", en: "Connect Charger to Slot {{slotNumber}}" },
  "initialPromptConnect.instruction": { ko: "{{vehicleModel}}에 충전 케이블을 연결해주세요.", en: "Please connect the charging cable to your {{vehicleModel}}." },
  "initialPromptConnect.portLocation": { ko: "충전 포트는 일반적으로 {{portLocationDescription}}에 있습니다.", en: "The charging port is typically located {{portLocationDescription}}." },
  "initialPromptConnect.alt.connectionImage": { ko: "충전기 연결 방법", en: "How to connect charger" },
  "initialPromptConnect.button.connected": { ko: "충전기를 연결했습니다", en: "Charger Connected" },

  // === SelectConnectorTypeScreen ===
  "selectConnectorType.title": { ko: "충전 커넥터 유형 선택", en: "Select Connector Type" },
  "selectConnectorType.instruction": { ko: "차량에 맞는 충전 커넥터 유형을 선택해주세요.", en: "Please select the appropriate connector type for your vehicle." },
  "selectConnectorType.vehicleModelHint": { ko: "({{vehicleModel}})", en: "({{vehicleModel}})" },
  "selectConnectorType.badge.recommended": { ko: "추천", en: "Recommended" },
  "selectConnectorType.button.cancel": { ko: "선택 취소", en: "Cancel Selection" },
  "selectConnectorType.quickModeAutoSelect": { ko: "빠른 시작 모드: {{connectorName}} 커넥터가 자동으로 선택되었습니다.", en: "Quick Start Mode: {{connectorName}} connector auto-selected." },


  "connector.ac_type_1.name": { ko: "AC 타입 1", en: "AC Type 1" },
  "connector.ac_type_1.description": { ko: "완속 (구형/북미 차종)", en: "Slow (Older/North American models)" },
  "connector.ccs_combo_2.name": { ko: "DC 콤보 CCS2", en: "DC Combo CCS2" },
  "connector.ccs_combo_2.description": { ko: "DC 급속 충전 (국내 표준)", en: "DC Fast Charge (Korean Standard)" },
  "connector.chademo.name": { ko: "DC 차데모", en: "DC CHAdeMO" },
  "connector.chademo.description": { ko: "DC 급속 충전 (일부 차종)", en: "DC Fast Charge (Some models)" },

  // === DetectConnectionScreen ===
  "detectConnection.title.detecting": { ko: "차량 연결 감지 중", en: "Detecting Vehicle Connection" },
  "detectConnection.title.success": { ko: "연결 성공!", en: "Connection Successful!" },
  "detectConnection.message.detecting": { ko: "{{vehicleModel}}과의 연결을 확인하는 동안 잠시 기다려주십시오...", en: "Please wait while we confirm the connection with your {{vehicleModel}}..." },
  "detectConnection.message.success": { ko: "{{vehicleModel}}이(가) 성공적으로 연결되고 인식되었습니다.", en: "Your {{vehicleModel}} has been successfully connected and recognized." },
  "detectConnection.message.proceeding": { ko: "다음 단계로 진행 중...", en: "Proceeding to the next step..." },
  "detectConnection.quickModeAutoStart": { ko: "빠른 시작 모드: 자동으로 충전을 시작합니다.", en: "Quick Start Mode: Automatically starting charge." },


  // === ConfirmStartChargingScreen ===
  "confirmStartCharging.title": { ko: "충전 준비가 되셨습니까?", en: "Ready to Charge?" },
  "confirmStartCharging.instruction": { ko: "\"충전 시작\"을 누르거나 타이머가 시작될 때까지 기다리십시오.", en: "Press 'Start Charging' or wait for the timer to begin." },
  "confirmStartCharging.autoStartMessage": { ko: "초 후 자동 시작", en: "seconds until auto-start" },
  "confirmStartCharging.button.startNow": { ko: "지금 충전 시작", en: "Start Charging Now" },

  // === ChargingInProgressScreen ===
  "chargingInProgress.title": { ko: "{{slotNumber}}번 슬롯에서 충전 중", en: "Charging at Slot {{slotNumber}}" },
  "chargingInProgress.currentSession": { ko: "현재 세션 (목표: 100%)", en: "Current Session (Target: 100%)" },
  "chargingInProgress.label.charged": { ko: "충전됨", en: "Charged" },
  "chargingInProgress.label.energySupplied": { ko: "공급된 에너지", en: "Energy Supplied" },
  "chargingInProgress.label.chargingTime": { ko: "충전 시간", en: "Charging Time" },
  "chargingInProgress.label.estimatedCost": { ko: "예상 비용", en: "Estimated Cost" },
  "chargingInProgress.label.remainingTime": { ko: "~100%까지 약 {{minutes}}분 남음", en: "Approx. {{minutes}} min to 100%" },
  "chargingInProgress.button.stopCharging": { ko: "충전 중지", en: "Stop Charging" },
  "chargingInProgress.noticesButton": { ko: "공지사항", en: "Notices" },
  "chargingInProgress.troubleshootingButton": { ko: "문제 해결", en: "Troubleshooting" },

  // === ChargingTipsDisplay ===
  "chargingTips.title": { ko: "유용한 팁", en: "Helpful Tips" },
  "chargingTips.tip1": { ko: "알고 계셨나요? 정기적인 타이어 공기압 점검은 EV의 주행 가능 거리를 향상시킬 수 있습니다!", en: "Did you know? Regular tire pressure checks can improve your EV's range!" },
  "chargingTips.tip2": { ko: "부드러운 가속과 제동은 EV 효율을 크게 높입니다.", en: "Smooth acceleration and braking significantly increase EV efficiency." },
  "chargingTips.tip3": { ko: "플러그가 꽂혀 있는 동안 EV 실내를 미리 조절하면 배터리를 절약할 수 있습니다.", en: "Pre-conditioning your EV's cabin while plugged in saves battery." },
  "chargingTips.tip4": { ko: "EV는 배기가스 배출이 없어 더 깨끗한 공기에 기여합니다.", en: "EVs produce zero tailpipe emissions, contributing to cleaner air." },
  "chargingTips.tip5": { ko: "회생 제동을 효과적으로 사용하면 에너지를 회수하고 주행 가능 거리를 늘릴 수 있습니다.", en: "Using regenerative braking effectively can recover energy and extend range." },
  "chargingTips.tip80Percent": { 
    ko: "왜 80%까지만 충전하는 것을 권장하나요?\n\n고객님의 안전과 이 충전 슬롯 사용을 기다리는 다른 EV 운전자들의 효율성을 위해, 저희 시스템은 기본적으로 차량을 80%까지 충전하도록 최적화되어 있습니다.\n\n충전 속도는 일반적으로 80% 이후에 현저히 느려지며, 100%에 도달하기 위해 추가로 소요되는 시간은 다른 사용자들에게 불필요한 지연을 유발할 수 있습니다. 많은 경우, 80%에서 100%까지 충전하는 데 첫 80%에 도달하는 만큼의 시간이 걸릴 수 있습니다.\n\n80%에서 세션을 완료함으로써, 대기 시간을 줄이고 충전기 가용성을 높이며, 더 지속 가능하고 배려심 있는 EV 충전 문화를 지원하는 데 도움을 주십니다.\n\n여전히 완전 충전이 필요하시다면, 다른 사용자들이 스테이션을 이용할 기회를 가진 후 수동으로 세션을 연장하실 수 있습니다.", 
    en: "Why do we recommend charging only up to 80%?\n\nFor your safety and the efficiency of other EV drivers waiting to use this charging slot, our system is optimized to charge vehicles up to 80% by default.\n\nCharging speeds typically slow down significantly after 80%, and the additional time spent reaching 100% could cause unnecessary delays for other users. In many cases, charging from 80% to 100% can take as long as it takes to reach the first 80%.\n\nBy completing your session at 80%, you’re helping to reduce wait times, increase charger availability, and support a more sustainable and considerate EV charging culture.\n\nIf you still require a full charge, you may manually extend your session after others have had a chance to use the station." 
  },

  // === WaitTimeDisplay (within ChargingInProgressScreen) ===
  "waitTimeDisplay.title": { ko: "충전 상태 및 대기 시간", en: "Charging Status & Wait Times" },
  "waitTimeDisplay.slot": { ko: "슬롯", en: "Slot" },
  "waitTimeDisplay.status.available": { ko: "사용 가능", en: "Available" },
  "waitTimeDisplay.status.maintenance": { ko: "점검 중", en: "Maintenance" },
  "waitTimeDisplay.vehicleInfo": { ko: "차량", en: "Vehicle" },
  "waitTimeDisplay.estimatedCompletion": { ko: "예상 완료 시간", en: "Est. Completion" },
  "waitTimeDisplay.calculating": { ko: "계산 중...", en: "Calculating..." },
  "waitTimeDisplay.chargedPercentage": { ko: "% 충전됨", en: "% Charged" },
  "waitTimeDisplay.almostDone": { ko: "거의 완료되었습니다!", en: "Almost Done!" },
  "waitTimeDisplay.connectAndCharge": { ko: "지금 연결하여 충전을 시작하세요!", en: "Connect now to start charging!" },
  "waitTimeDisplay.underMaintenance": { ko: "이 슬롯은 현재 점검 중입니다.", en: "This slot is currently under maintenance." },

  // === LocalBusinessDisplay ===
  "localBusiness.title": { ko: "주변 업체", en: "Nearby Businesses" },
  "localBusiness.cafe.name": { ko: "아늑한 카페", en: "Cozy Cafe" },
  "localBusiness.cafe.type": { ko: "카페", en: "Cafe" },
  "localBusiness.cafe.description": { ko: "기다리는 동안 신선한 커피와 페이스트리를 즐기세요.", en: "Enjoy fresh coffee and pastries while you wait." },
  "localBusiness.cafe.distance": { ko: "도보 2분", en: "2 min walk" },
  "localBusiness.mart.name": { ko: "퀵 마트", en: "Quick Mart" },
  "localBusiness.mart.type": { ko: "편의점", en: "Convenience Store" },
  "localBusiness.mart.description": { ko: "간식, 음료, 필수품을 구입하세요.", en: "Grab snacks, drinks, and essentials." },
  "localBusiness.mart.distance": { ko: "도보 1분", en: "1 min walk" },
  "localBusiness.bookstore.name": { ko: "북 누크", en: "Book Nook" },
  "localBusiness.bookstore.type": { ko: "서점", en: "Bookstore" },
  "localBusiness.bookstore.description": { ko: "다양한 책과 잡지를 둘러보세요.", en: "Browse a wide selection of books and magazines." },
  "localBusiness.bookstore.distance": { ko: "도보 5분", en: "5 min walk" },
  "localBusiness.bakery.name": { ko: "달콤 제과점", en: "Sweet Treats Bakery" },
  "localBusiness.bakery.type": { ko: "제과점", en: "Bakery" },
  "localBusiness.bakery.description": { ko: "갓 구운 빵과 디저트를 맛보세요.", en: "Taste freshly baked bread and desserts." },
  "localBusiness.bakery.distance": { ko: "도보 3분", en: "3 min walk" },
  "localBusiness.pharmacy.name": { ko: "튼튼 약국", en: "Healthy Pharmacy" },
  "localBusiness.pharmacy.type": { ko: "약국", en: "Pharmacy" },
  "localBusiness.pharmacy.description": { ko: "필요한 의약품이나 건강 용품을 찾아보세요.", en: "Find necessary medicines or health supplies." },
  "localBusiness.pharmacy.distance": { ko: "도보 4분", en: "4 min walk" },
  "localBusiness.button.showMore": { ko: "더 보기", en: "Show More" },
  "localBusiness.button.showLess": { ko: "간단히 보기", en: "Show Less" },


  // === MapModal ===
  "mapModal.title": { ko: "{{businessName}} 위치", en: "{{businessName}} Location" },
  "mapModal.alt.mapImage": { ko: "{{businessName}}을(를) 보여주는 지도", en: "Map showing {{businessName}}" },
  "mapModal.button.zoomIn": { ko: "확대", en: "Zoom In" },
  "mapModal.button.zoomOut": { ko: "축소", en: "Zoom Out" },
  "mapModal.sr.close": { ko: "닫기", en: "Close" },

  // === NoticesDisplay ===
  "notices.dialogTitle": { ko: "주요 공지사항", en: "Important Notices" },
  "notices.button.close": { ko: "닫기", en: "Close" },
  "notices.noNotices": { ko: "현재 등록된 공지사항이 없습니다.", en: "There are no notices at this time." },
  "notices.postedDate": {ko: "게시일", en: "Posted Date"},
  "notice1.title": { ko: "정기 시스템 점검 안내", en: "Scheduled System Maintenance" },
  "notice1.content": { ko: "보다 안정적인 서비스 제공을 위해 2024년 8월 15일 오전 2시부터 오전 4시까지 시스템 점검이 진행될 예정입니다. 이 시간에는 서비스 이용이 일시적으로 중단될 수 있습니다. 고객님의 양해 부탁드립니다.", en: "For more stable service, system maintenance will be conducted on August 15, 2024, from 2 AM to 4 AM. Service may be temporarily unavailable during this time. We appreciate your understanding." },
  "notice2.title": { ko: "새로운 초고속 충전기 설치 완료!", en: "New Ultra-Fast Charger Installed!" },
  "notice2.content": { ko: "B구역에 새로운 200kW급 초고속 충전기가 설치되었습니다. 더 빠르고 편리한 충전 경험을 제공해 드립니다. 많은 이용 바랍니다.", en: "A new 200kW ultra-fast charger has been installed in Zone B. Enjoy a faster and more convenient charging experience. We encourage you to use it." },
  "notice3.title": { ko: "여름철 충전 요금 할인 이벤트", en: "Summer Charging Fee Discount Event" },
  "notice3.content": { ko: "7월 1일부터 8월 31일까지 여름맞이 충전 요금 10% 할인 이벤트가 진행됩니다. 시원한 여름, 알뜰한 충전을 즐기세요! (일부 시간대 제외)", en: "From July 1st to August 31st, a 10% discount event on summer charging fees will be held. Enjoy cool summers and economical charging! (Excluding some time slots)" },
  "notice4.title": { ko: "주차장 이용 안내 변경", en: "Parking Lot Usage Guide Change" },
  "notice4.content": { ko: "2024년 9월 1일부터 충전 완료 후 15분 이상 주차 시 추가 요금이 부과됩니다. 원활한 충전소 운영을 위해 협조해주시기 바랍니다.", en: "Starting September 1, 2024, an additional fee will be charged for parking more than 15 minutes after charging is complete. Please cooperate for smooth charging station operation." },

  // === TroubleshootingGuide ===
  "troubleshooting.title": { ko: "문제 해결 가이드", en: "Troubleshooting Guide" },
  "troubleshooting.button.callStaff": { ko: "직원 호출", en: "Call Staff" },
  "troubleshooting.toast.staffCalled.title": { ko: "직원 호출", en: "Staff Called" },
  "troubleshooting.toast.staffCalled.description": { ko: "직원을 호출했습니다. 잠시만 기다려주세요.", en: "Staff has been called. Please wait a moment." },
  "ts1.question": { ko: "충전기가 시작되지 않거나 오류 표시등이 켜집니다.", en: "Charger won't start or error light is on." },
  "ts1.answer": { ko: "1. 충전 케이블이 차량과 충전 스테이션 양쪽에 단단히 연결되었는지 확인하십시오.\n2. 스테이션의 비상 정지 버튼이 눌렸는지 확인하십시오. 그렇다면 재설정하십시오.\n3. 가능하다면 다른 충전 케이블을 사용해 보십시오.\n4. 문제가 지속되면 오류 메시지를 기록하고 지원팀에 문의하십시오.", en: "1. Ensure the charging cable is securely connected to both the vehicle and the charging station.\n2. Check if the station's emergency stop button has been pressed; reset if so.\n3. Try a different charging cable if available.\n4. If the problem persists, note any error messages and contact support." },
  "ts2.question": { ko: "차량이 예상보다 느리게 충전됩니다.", en: "Vehicle is charging slower than expected." },
  "ts2.answer": { ko: "1. 충전 속도는 차량 배터리 온도 및 현재 충전 수준의 영향을 받을 수 있습니다.\n2. 일부 스테이션은 전원을 공유할 수 있습니다. 다른 차량이 충전 중이면 속도가 느려질 수 있습니다.\n3. 차량 설정이 최대 충전 속도를 수용하도록 구성되었는지 확인하십시오.", en: "1. Charging speed can be affected by vehicle battery temperature and current charge level.\n2. Some stations may share power; speed can be reduced if other vehicles are charging.\n3. Ensure your vehicle settings are configured to accept maximum charging speed." },
  "ts3.question": { ko: "결제 또는 청구에 문제가 있습니다.", en: "Having trouble with payment or billing." },
  "ts3.answer": { ko: "1. 계정에 연결된 결제 방법을 다시 확인하십시오.\n2. 즉각적인 문제의 경우 키오스크 또는 앱에 표시된 지원 라인에 문의하십시오.\n3. 온라인 계정 프로필에서 충전 내역 및 영수증을 볼 수 있습니다.", en: "1. Double-check the payment method linked to your account.\n2. For immediate issues, contact the support line displayed on the kiosk or app.\n3. You can view charging history and receipts in your online account profile." },
  "ts4.question": { ko: "화면이 응답하지 않거나 멈췄습니다.", en: "The screen is unresponsive or frozen." },
  "ts4.answer": { ko: "불편을 드려 죄송합니다. 잠시 기다려 주십시오. 문제가 지속되면 키오스크 재설정 버튼을 찾거나 가능한 경우 직원에게 문의하십시오. 이 문제는 일반적으로 일시적입니다.", en: "We apologize for the inconvenience. Please wait a moment. If the issue persists, look for a kiosk reset button or contact staff if available. This issue is usually temporary." },
  "ts5.question": { ko: "충전 세션을 어떻게 중지합니까?", en: "How do I stop a charging session?" },
  "ts5.answer": { ko: "이 화면에 명확하게 표시된 \"충전 중지\" 버튼을 누르십시오. 화면의 지시에 따라 확인하십시오. 세션이 종료된 후 차량에서 케이블이 올바르게 분리되었는지 확인하십시오.", en: "Press the \"Stop Charging\" button clearly displayed on this screen. Follow on-screen prompts to confirm. Ensure the cable is properly disconnected from your vehicle after the session ends." },

  // === PaymentScreen (CHARGING_COMPLETE_PAYMENT) ===
  "payment.title.complete": { ko: "충전 완료!", en: "Charging Complete!" },
  "payment.instruction.disconnect": { ko: "차량에서 충전 커넥터를 분리하십시오.", en: "Please disconnect the charging connector from your vehicle." },
  "payment.finalBill.title": { ko: "최종 청구서", en: "Final Bill" },
  "payment.finalBill.energy": { ko: "사용된 에너지", en: "Energy Used" },
  "payment.finalBill.duration": { ko: "사용 시간", en: "Duration" },
  "payment.finalBill.durationMinutesUnit": { ko: "분", en: "min" },
  "payment.finalBill.total": { ko: "총계", en: "Total Amount" },
  "payment.selectMethod": { ko: "결제 방법 선택:", en: "Select Payment Method:" },
  "payment.button.payByCard": { ko: "카드로 결제", en: "Pay with Card" },
  "payment.button.payByNFC": { ko: "모바일 NFC로 결제", en: "Pay with Mobile NFC" },
  "payment.button.payByQR": { ko: "QR 스캔으로 결제", en: "Pay with QR Scan" },
  "payment.processing.title": { ko: "결제 처리 중...", en: "Processing Payment..." },
  "payment.processing.message": { ko: "결제가 처리되는 동안 잠시 기다려주십시오.", en: "Please wait while your payment is being processed." },
  "payment.success.title": { ko: "결제 성공!", en: "Payment Successful!" },
  "payment.receipt.question": { ko: "영수증은 어떻게 하시겠습니까?", en: "How would you like your receipt?" },
  "payment.receipt.sms": { ko: "내 휴대폰으로 전송 (SMS)", en: "Send to my phone (SMS)" },
  "payment.receipt.qr": { ko: "QR 코드로 영수증 스캔", en: "Scan QR code for receipt" },
  "payment.receipt.none": { ko: "영수증 필요 없음", en: "No receipt needed" },
  "payment.toast.smsDemo.title": { ko: "SMS 영수증", en: "SMS Receipt" },
  "payment.toast.smsDemo.description": { ko: "SMS 기능은 데모입니다. 실제 메시지는 전송되지 않습니다.", en: "SMS feature is a demo. No actual message will be sent." },

  // === VacateSlotReminderScreen ===
  "vacateSlot.title": { ko: "조치 필요", en: "Action Required" },
  "vacateSlot.message.waiting": { ko: "다른 차량이 대기 중입니다", en: "Another vehicle is waiting" },
  "vacateSlot.message.vacateIn": { ko: "다음 {{time}} 이내에 충전 슬롯을 비워주십시오.", en: "Please vacate the charging slot within the next {{time}}." },
  "vacateSlot.message.autoClose": { ko: "이 화면은 자동으로 닫힙니다.", en: "This screen will close automatically." },
  "vacateSlot.tip.enjoySnack": { ko: "다음 충전 세션을 기다리는 동안 가벼운 간식을 즐기실 수 있습니다.", en: "You can enjoy a quick snack while waiting for the next session." },


  // === ThankYouScreen ===
  "thankYou.title": { ko: "감사합니다!", en: "Thank You!" },
  "thankYou.message.enjoyCharge": { ko: "충전을 즐기십시오! 이 화면은 곧 초기화됩니다.", en: "Enjoy your charge! This screen will reset shortly." },
  "thankYou.message.smsSent": { ko: "영수증이 SMS로 전송되었습니다. 이 화면은 곧 초기화됩니다.", en: "Your receipt has been sent via SMS. This screen will reset shortly." },
  "thankYou.message.qrScan": { ko: "아래 QR 코드를 스캔하여 영수증을 받으십시오. 이 화면은 곧 초기화됩니다.", en: "Scan the QR code below for your receipt. This screen will reset shortly." },
  "thankYou.alt.qrCode": { ko: "영수증 QR 코드", en: "Receipt QR Code" },
  "thankYou.button.newSession": { ko: "새 충전 세션 시작", en: "Start New Charging Session" },
  "thankYou.autoResetMessage": { ko: "{{seconds}}초 후 자동 초기화...", en: "Auto-reset in {{seconds}} seconds..." },

  // === QueueScreen ===
  "queue.title": { ko: "모든 슬롯 사용 중", en: "All Slots Occupied" },
  "queue.message.allOccupied": { ko: "현재 모든 충전 슬롯이 사용 중입니다.", en: "Currently, all charging slots are in use." },
  "queue.position": { ko: "대기열에서 <span class=\"text-primary font-bold text-3xl\">{{position}}</span>번째입니다.", en: "You are <span class=\"text-primary font-bold text-3xl\">{{position}}</span> in the queue." },
  "queue.estimatedWaitTime": { ko: "예상 대기 시간: <span class=\"text-primary font-bold\">{{time}}</span>.", en: "Estimated wait time: <span class=\"text-primary font-bold\">{{time}}</span>." },
  "queue.notificationSoon": { ko: "슬롯이 사용 가능해지면 알려드릴 수 있습니다 (기능 곧 제공 예정).", en: "We can notify you when a slot becomes available (feature coming soon)." },
  "queue.button.cancel": { ko: "취소하고 대기열 나가기", en: "Cancel and Leave Queue" },
  "queue.defaultWaitTime": { ko: "약 10분", en: "Approx. 10 minutes" },

  // === SlotAssignmentScreen ===
  "slotAssignment.title.assigning": { ko: "충전 슬롯 할당 중", en: "Assigning Charging Slot" },
  "slotAssignment.title.queueCheck": { ko: "대기열 상태 확인 중", en: "Checking Queue Status" },
  "slotAssignment.message.assigning": { ko: "사용 가능한 최적의 충전 슬롯을 찾고 있습니다...", en: "Finding the best available charging slot for you..." },
  "slotAssignment.message.queueCheck": { ko: "모든 슬롯이 현재 사용 중입니다. 대기열에서 귀하의 위치를 확인 중입니다...", en: "All slots are currently in use. Checking your position in the queue..." },


  // === ScanningScreen (Generic) ===
  "scanning.title": { ko: "차량 스캔 중", en: "Scanning Vehicle" },
  "scanning.message": { ko: "차량을 식별하는 동안 잠시 기다려주십시오...", en: "Identifying your vehicle, please wait..." },
  "scanning.detecting": { ko: "감지 중...", en: "Detecting..." },

  // === General Toasts from page.tsx ===
  "toast.error.noSlotInfo.title": {ko: "오류", en: "Error"},
  "toast.error.noSlotInfo.description": { ko: "슬롯, 차량 정보 또는 커넥터 유형이 선택되지 않았습니다.", en: "Slot, vehicle information, or connector type not selected." },

  // === App Layout ===
  "layout.title.ko": { ko: "eCharge 키오스크", en: "eCharge Kiosk" },
  "layout.title.en": { ko: "eCharge Kiosk", en: "eCharge Kiosk" },
  "layout.description.ko": { ko: "스마트 EV 충전 솔루션", en: "Smart EV Charging Solution" },
  "layout.description.en": { ko: "Smart EV Charging Solution", en: "Smart EV Charging Solution" },
  
  // === ChargingErrorScreen ===
  "chargingError.title": { ko: "충전 오류", en: "Charging Error" },
  "chargingError.messageDefault": { ko: "예상치 못한 오류로 인해 충전을 시작하거나 계속할 수 없습니다. 연결을 확인하고 다시 시도하거나 취소하십시오.", en: "Charging could not be started or continued due to an unexpected error. Please check your connection and try again, or cancel." },
  "chargingError.messageCableDisconnect": {ko: "케이블 연결 오류: 충전 케이블이 차량에서 분리된 것 같습니다. 케이블 연결을 확인하고 다시 시도해 주십시오.", en: "Cable Connection Error: The charging cable seems to have been disconnected from your vehicle. Please check the cable connection and try again."},
  "chargingError.button.retry": { ko: "다시 시도", en: "Try Again" },
  "chargingError.simulateErrorButton": { ko: "충전 오류 시뮬레이션", en: "Simulate Charging Error" },

  // Fallback for missing keys
  "missing.translation": { ko: "번역 없음: {{key}}", en: "Missing translation: {{key}}" },
};

export function t(lang: Language, key: string, params?: Record<string, string | number | undefined>): string {
  const entry = translations[key];
  let textToShow: string;

  if (entry && entry[lang]) {
    textToShow = entry[lang];
  } else if (entry && entry['ko']) {
    console.warn(`Missing '${lang}' translation for key: ${key}. Falling back to Korean.`);
    textToShow = entry['ko'];
  } else {
    console.error(`Missing translation for key: ${key} (no fallback available).`);
    return translations["missing.translation"][lang] ? translations["missing.translation"][lang].replace('{{key}}', key) : key;
  }

  if (params) {
    for (const pKey in params) {
      if (params[pKey] !== undefined) {
        textToShow = textToShow.replace(new RegExp(`{{${pKey}}}`, 'g'), String(params[pKey]));
      }
    }
  }
  return textToShow;
}

    
