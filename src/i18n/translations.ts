/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, PredictionPrompt, QuizQuestion } from '../types';

export const TRANSLATIONS = {
  vi: {
    // Header & Info
    'app.title': 'Thí nghiệm ảo: Lăng kính',
    'app.subtitle': 'Quan sát đường truyền ánh sáng qua lăng kính',
    'app.curriculumTag': 'KHTN 9 • Bài 7 • Kết nối tri thức',
    'app.disclaimer': 'Mô hình học tập 2D bổ trợ thí nghiệm thực hành trong phòng bộ môn.',
    
    // Controls
    'control.incidenceAngle': 'Góc tới',
    'control.lightMode': 'Loại ánh sáng',
    'control.color': 'Màu ánh sáng',
    'control.presets': 'Góc mẫu',
    'control.speed': 'Tốc độ',
    'control.showNormals': 'Hiện pháp tuyến (N₁, N₂)',
    'control.showAngles': 'Hiện góc (i, r₁, r₂, e, D)',
    'control.showRayExtension': 'Hiện đường kéo dài tia tới',
    'control.showScreen': 'Hiện màn quan sát',
    'control.viewMode': 'Chế độ xem',
    'control.stepThrough': 'Từng bước',
    'control.stepLabel': 'Bước',
    'control.stepIncident': '1. Tia tới đập vào mặt bên 1',
    'control.stepRefract1': '2. Khúc xạ vào trong lăng kính (lệch về gần pháp tuyến)',
    'control.stepRefract2': '3. Khúc xạ ra ngoài không khí (lệch xa pháp tuyến)',
    'control.stepScreen': '4. Tia ló truyền tới màn quan sát',

    // Light types
    'light.white': 'Ánh sáng trắng',
    'light.monochromatic': 'Ánh sáng đơn sắc',

    // Actions
    'action.predict': 'Dự đoán hiện tượng',
    'action.testPrediction': 'Kiểm tra dự đoán',
    'action.play': 'Chạy mô phỏng',
    'action.pause': 'Tạm dừng',
    'action.step': 'Xem từng bước',
    'action.reset': 'Đặt lại ban đầu',
    'action.nextQuestion': 'Câu tiếp theo',
    'action.submitAnswer': 'Xác nhận câu trả lời',
    'action.retryQuiz': 'Làm lại thử thách',
    'action.nextHint': 'Xem gợi ý tiếp theo',
    'action.prevHint': 'Gợi ý trước',

    // Canvas Labels
    'label.incidentRay': 'Tia tới',
    'label.refractedRay': 'Tia khúc xạ',
    'label.emergentRay': 'Tia ló',
    'label.normal': 'Pháp tuyến',
    'label.prismBase': 'Đáy lăng kính',
    'label.screen': 'Màn quan sát',
    'label.apexAngle': 'Góc chiết quang A = 60°',
    'label.lightSource': 'Nguồn sáng',
    'label.incidentExtension': 'Đường kéo dài tia tới',

    // Measures
    'measure.incidence': 'Góc tới i',
    'measure.refraction': 'Góc khúc xạ r₁',
    'measure.internalIncidence': 'Góc tới tại mặt thứ hai r₂',
    'measure.emergence': 'Góc ló e',
    'measure.deviation': 'Góc lệch D',
    'measure.unit': 'độ',
    'measure.colorCol': 'Màu',
    'measure.wavelengthCol': 'Bước sóng',
    'measure.indexCol': 'Chiết suất n',
    'measure.deviationCol': 'Góc lệch D',

    // Observation
    'observation.title': 'Kết quả quan sát',
    'observation.spectrum': 'Dải quang phổ ánh sáng nhìn thấy',
    'observation.noSpectrum': 'Không tạo thành quang phổ nhiều màu',
    'observation.spectrumSummary': 'Ánh sáng trắng bị tán sắc thành dải màu liên tục từ Đỏ đến Tím trên màn quan sát.',
    'observation.monoSummary': 'Ánh sáng đơn sắc bị lệch hướng (khúc xạ) nhưng KHÔNG bị tách thành các màu khác.',
    'observation.deviationRule': 'Tia tím bị lệch nhiều nhất (D lớn nhất), tia đỏ bị lệch ít nhất (D nhỏ nhất). Cả hai đều lệch về phía đáy lăng kính.',
    'observation.modelNote': 'Mô hình chiết suất quang học thủy tinh Crown (n = 1.514 - 1.538) minh họa định tính theo chương trình SGK.',

    // Feedback
    'feedback.hint': 'Gợi ý học tập',
    'feedback.tryAgain': 'Thử lại',
    'feedback.explanation': 'Giải thích khoa học',
    'feedback.correctPrediction': 'Chính xác! Dự đoán của bạn hoàn toàn phù hợp với định luật vật lí.',
    'feedback.incorrectPrediction': 'Chưa chính xác. Hãy xem kết quả thực nghiệm và đối chiếu lại nhé.',

    // Assessment
    'assessment.title': 'Thử thách cuối: Kiểm tra kiến thức',
    'assessment.subtitle': '5 câu hỏi trắc nghiệm củng cố kiến thức Bài 7 - Lăng kính',
    'assessment.score': 'Điểm',
    'assessment.question': 'Câu hỏi',
    'assessment.congratsPerfect': 'Xuất sắc! Bạn đã nắm vững toàn bộ kiến thức về lăng kính và tán sắc ánh sáng.',
    'assessment.goodEffort': 'Tốt! Bạn đã nắm được phần lớn kiến thức, hãy xem lại câu sai để hiểu sâu hơn.',
    'assessment.reviewNeeded': 'Hãy quan sát lại đường truyền tia sáng và dải quang phổ rồi thử lại nhé!',

    // Status
    'status.valid': 'Tia sáng truyền qua lăng kính và tạo tia ló hợp lệ.',
    'status.tirOccurred': 'Hiện tượng phản xạ toàn phần tại mặt bên thứ 2 (không có tia ló). Hãy tăng góc tới i.',
    'status.invalidGeometry': 'Không có đường truyền hợp lệ ở góc này. Hãy điều chỉnh góc tới.',
    'status.predictionRequired': 'Hãy chọn dự đoán trước khi kiểm tra.',

    // Accessibility
    'accessibility.rayDescription': 'Mô tả đường truyền tia sáng hiện tại: Tia sáng truyền từ không khí vào mặt thứ nhất của lăng kính, khúc xạ về gần pháp tuyến, sau đó tới mặt thứ hai và ló ra ngoài không khí lệch xa pháp tuyến về phía đáy lăng kính.',
    'accessibility.languageSwitch': 'Chuyển ngôn ngữ sang Tiếng Anh',
    'accessibility.dragHandle': 'Kéo để thay đổi góc tới i của chùm sáng',
  },
  en: {
    // Header & Info
    'app.title': 'Virtual Experiment: Prism',
    'app.subtitle': 'Observe how light travels through a triangular prism',
    'app.curriculumTag': 'Grade 9 Natural Science • Lesson 7 • Prism',
    'app.disclaimer': '2D educational simulation complementing physical laboratory hands-on experiments.',

    // Controls
    'control.incidenceAngle': 'Angle of incidence',
    'control.lightMode': 'Light type',
    'control.color': 'Light color',
    'control.presets': 'Presets',
    'control.speed': 'Speed',
    'control.showNormals': 'Show normals (N₁, N₂)',
    'control.showAngles': 'Show angles (i, r₁, r₂, e, D)',
    'control.showRayExtension': 'Show incident ray extension',
    'control.showScreen': 'Show observation screen',
    'control.viewMode': 'View mode',
    'control.stepThrough': 'Step-by-step',
    'control.stepLabel': 'Step',
    'control.stepIncident': '1. Incident ray strikes first face',
    'control.stepRefract1': '2. Refracts into prism (bends toward normal)',
    'control.stepRefract2': '3. Refracts into air (bends away from normal)',
    'control.stepScreen': '4. Emergent ray reaches observation screen',

    // Light types
    'light.white': 'White light',
    'light.monochromatic': 'Monochromatic light',

    // Actions
    'action.predict': 'Make a prediction',
    'action.testPrediction': 'Test prediction',
    'action.play': 'Play simulation',
    'action.pause': 'Pause',
    'action.step': 'Step through',
    'action.reset': 'Reset',
    'action.nextQuestion': 'Next question',
    'action.submitAnswer': 'Submit answer',
    'action.retryQuiz': 'Retry challenge',
    'action.nextHint': 'Next hint',
    'action.prevHint': 'Previous hint',

    // Canvas Labels
    'label.incidentRay': 'Incident ray',
    'label.refractedRay': 'Refracted ray',
    'label.emergentRay': 'Emergent ray',
    'label.normal': 'Normal',
    'label.prismBase': 'Prism base',
    'label.screen': 'Observation screen',
    'label.apexAngle': 'Prism apex angle A = 60°',
    'label.lightSource': 'Light source',
    'label.incidentExtension': 'Incident ray extension',

    // Measures
    'measure.incidence': 'Incidence angle i',
    'measure.refraction': 'Refraction angle r₁',
    'measure.internalIncidence': 'Incidence angle at second face r₂',
    'measure.emergence': 'Emergence angle e',
    'measure.deviation': 'Deviation angle D',
    'measure.unit': 'deg',
    'measure.colorCol': 'Color',
    'measure.wavelengthCol': 'Wavelength',
    'measure.indexCol': 'Index n',
    'measure.deviationCol': 'Deviation D',

    // Observation
    'observation.title': 'Observations',
    'observation.spectrum': 'Visible light spectrum',
    'observation.noSpectrum': 'No multicolor spectrum is formed',
    'observation.spectrumSummary': 'White light disperses into a continuous spectrum from Red to Violet on the screen.',
    'observation.monoSummary': 'Monochromatic light refracts and deviates but is NOT separated into multiple colors.',
    'observation.deviationRule': 'Violet deviates the most (largest D), red deviates the least (smallest D). Both deviate toward the prism base.',
    'observation.modelNote': 'Illustrative crown glass optical model (n = 1.514 - 1.538) matching qualitative curriculum standards.',

    // Feedback
    'feedback.hint': 'Study Hints',
    'feedback.tryAgain': 'Try again',
    'feedback.explanation': 'Scientific Explanation',
    'feedback.correctPrediction': 'Correct! Your prediction matches the physical laws of optics.',
    'feedback.incorrectPrediction': 'Not quite. Check the experimental simulation result and compare.',

    // Assessment
    'assessment.title': 'Final Challenge: Knowledge Check',
    'assessment.subtitle': '5 multiple-choice questions reinforcing Lesson 7 - Prism concepts',
    'assessment.score': 'Score',
    'assessment.question': 'Question',
    'assessment.congratsPerfect': 'Outstanding! You have thoroughly mastered refraction and dispersion through a prism.',
    'assessment.goodEffort': 'Good job! You understood most concepts; review the missed question for deeper insight.',
    'assessment.reviewNeeded': 'Observe the ray path and spectrum again, then give it another try!',

    // Status
    'status.valid': 'Light travels through prism and produces a valid emergent ray.',
    'status.tirOccurred': 'Total internal reflection at the second face (no emergent ray). Increase incidence angle i.',
    'status.invalidGeometry': 'No valid ray path at this angle. Adjust the incidence angle.',
    'status.predictionRequired': 'Choose a prediction before testing.',

    // Accessibility
    'accessibility.rayDescription': 'Description of current ray path: The incident light ray travels from air into the first prism face, refracts toward the normal, reaches the second face, and emerges into air deviating away from the normal toward the prism base.',
    'accessibility.languageSwitch': 'Switch language to Vietnamese',
    'accessibility.dragHandle': 'Drag to adjust light beam incidence angle i',
  },
};

export const PREDICTION_PROMPTS: PredictionPrompt[] = [
  {
    id: 'white-dispersion',
    titleVi: 'Dự đoán khi chiếu chùm ánh sáng trắng qua lăng kính',
    titleEn: 'Predict what happens when white light passes through a prism',
    questionVi: 'Khi chiếu một dải ánh sáng trắng hẹp qua lăng kính, chùm tia ló trên màn quan sát sẽ như thế nào?',
    questionEn: 'When a narrow white light beam passes through a triangular prism, what will appear on the observation screen?',
    options: [
      {
        id: 'opt1',
        textVi: 'Bị tách thành dải màu cầu vồng từ đỏ đến tím, lệch về phía đáy lăng kính',
        textEn: 'Disperses into a rainbow color band from red to violet, deviated toward the prism base',
        isCorrect: true,
        explanationVi: 'Chính xác! Ánh sáng trắng gồm vô số ánh sáng đơn sắc có bước sóng khác nhau. Do chiết suất của lăng kính đối với các màu khác nhau, chúng bị khúc xạ với các góc khác nhau tạo thành dải quang phổ.',
        explanationEn: 'Correct! White light consists of many monochromatic components with different wavelengths. Because the prism has different refractive indices for each color, they refract at different angles forming a visible spectrum.',
      },
      {
        id: 'opt2',
        textVi: 'Vẫn là một vệt sáng trắng duy nhất, chỉ bị dịch chuyển vị trí',
        textEn: 'Remains a single white light spot, only shifted in position',
        isCorrect: false,
        explanationVi: 'Chưa đúng. Ánh sáng trắng không phải là đơn sắc; mỗi màu thành phần bị bẻ gãy một góc khác nhau nên sẽ bị tách rời (tán sắc).',
        explanationEn: 'Incorrect. White light is not monochromatic; each component color refracts by a different angle, causing dispersion.',
      },
      {
        id: 'opt3',
        textVi: 'Lăng kính hấp thụ hoàn toàn và không có tia sáng nào đi qua',
        textEn: 'The prism completely absorbs the light and no ray passes through',
        isCorrect: false,
        explanationVi: 'Lăng kính thủy tinh trong suốt cho phép ánh sáng truyền qua và khúc xạ qua hai mặt bên.',
        explanationEn: 'A transparent glass prism allows light to transmit and refract through both lateral faces.',
      },
    ],
  },
  {
    id: 'monochromatic-behavior',
    titleVi: 'Dự đoán khi chiếu ánh sáng đơn sắc',
    titleEn: 'Predict what happens with monochromatic light',
    questionVi: 'Khi chiếu một chùm sáng đơn sắc (ví dụ ánh sáng đỏ hoặc lục) qua lăng kính thì hiện tượng gì xảy ra?',
    questionEn: 'When a monochromatic light beam (e.g. red or green) passes through the prism, what will happen?',
    options: [
      {
        id: 'opt1',
        textVi: 'Tia sáng bị khúc xạ lệch về phía đáy nhưng KHÔNG bị đổi màu hay tách màu',
        textEn: 'The ray is refracted toward the base but is NOT split or changed into other colors',
        isCorrect: true,
        explanationVi: 'Chính xác! Ánh sáng đơn sắc có bước sóng xác định, nên chiết suất của lăng kính với nó là duy nhất, do đó nó chỉ bị lệch hướng mà không bị tán sắc.',
        explanationEn: 'Correct! Monochromatic light has a single specific wavelength and refractive index, so it is only deflected in direction without dispersion.',
      },
      {
        id: 'opt2',
        textVi: 'Cũng bị tách thành 7 màu như ánh sáng trắng',
        textEn: 'Also splits into 7 colors just like white light',
        isCorrect: false,
        explanationVi: 'Sai. Lăng kính không tự sinh ra màu. Ánh sáng đơn sắc không chứa các màu khác nên không thể bị tách thành dải 7 màu.',
        explanationEn: 'Incorrect. The prism does not create colors. Monochromatic light does not contain other colors and cannot split into 7 colors.',
      },
      {
        id: 'opt3',
        textVi: 'Đi thẳng mà không hề bị đổi hướng truyền',
        textEn: 'Passes straight through without any change in direction',
        isCorrect: false,
        explanationVi: 'Sai. Khi truyền từ không khí vào thủy tinh (hai môi trường trong suốt khác nhau), tia sáng luôn bị khúc xạ tại mặt phân cách.',
        explanationEn: 'Incorrect. When traveling between different transparent media (air and glass), light always refracts at the boundary.',
      },
    ],
  },
  {
    id: 'angle-deviation',
    titleVi: 'Dự đoán về góc lệch giữa tia đỏ và tia tím',
    titleEn: 'Predict deviation comparison between red and violet light',
    questionVi: 'Trong hiện tượng tán sắc ánh sáng trắng qua lăng kính, tia nào bị lệch nhiều hơn về phía đáy?',
    questionEn: 'In white light dispersion through a prism, which color ray deviates more toward the base?',
    options: [
      {
        id: 'opt1',
        textVi: 'Tia tím bị lệch nhiều nhất, tia đỏ bị lệch ít nhất (D_tím > D_đỏ)',
        textEn: 'Violet deviates the most, red deviates the least (D_violet > D_red)',
        isCorrect: true,
        explanationVi: 'Chính xác! Chiết suất của thủy tinh đối với ánh sáng tím lớn nhất (n_tím > n_đỏ), nên ánh sáng tím bị bẻ cong nhiều nhất và có góc lệch D lớn nhất.',
        explanationEn: 'Correct! The refractive index of glass is highest for violet light (n_violet > n_red), meaning violet is refracted most strongly with the largest deviation angle D.',
      },
      {
        id: 'opt2',
        textVi: 'Tia đỏ bị lệch nhiều nhất, tia tím bị lệch ít nhất',
        textEn: 'Red deviates the most, violet deviates the least',
        isCorrect: false,
        explanationVi: 'Sai. Ánh sáng đỏ có bước sóng dài hơn, chiết suất nhỏ hơn nên bị lệch ít nhất trong dải quang phổ.',
        explanationEn: 'Incorrect. Red light has a longer wavelength and lower refractive index, so it deviates the least in the visible spectrum.',
      },
      {
        id: 'opt3',
        textVi: 'Tất cả các tia màu đều có góc lệch D hoàn toàn bằng nhau',
        textEn: 'All color rays have exactly equal deviation angles D',
        isCorrect: false,
        explanationVi: 'Nếu góc lệch bằng nhau thì chùm tia ló không thể tách thành dải quang phổ màu.',
        explanationEn: 'If deviations were equal, the emergent rays would not spread into a visible color spectrum.',
      },
    ],
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionVi: 'Góc tới i của tia sáng chiếu vào mặt bên lăng kính được đo so với đường nào?',
    questionEn: 'From which reference line is the angle of incidence i measured at the first prism face?',
    optionsVi: [
      'Pháp tuyến với mặt bên tại điểm tới',
      'Mặt phẳng của mặt bên lăng kính',
      'Đáy của lăng kính',
      'Phương của tia ló ra khỏi lăng kính',
    ],
    optionsEn: [
      'The normal to the first surface at the point of incidence',
      'The surface plane of the prism face',
      'The base of the prism',
      'The direction of the emergent ray',
    ],
    correctIndex: 0,
    explanationVi: 'Quy ước quang hình học: Các góc tới và góc khúc xạ luôn được xác định là góc giữa tia sáng và PHÁP TUYẾN (đường vuông góc với mặt phân cách tại điểm tới).',
    explanationEn: 'Geometrical optics convention: Incidence and refraction angles are always measured between the light ray and the surface NORMAL at the point of incidence.',
  },
  {
    id: 2,
    questionVi: 'Khi tia sáng truyền từ không khí vào lăng kính thủy tinh (n_lăng kính > n_không khí), tia khúc xạ trong lăng kính sẽ như thế nào so với pháp tuyến?',
    questionEn: 'When light travels from air into the glass prism (n_prism > n_air), how does the refracted ray behave relative to the normal?',
    optionsVi: [
      'Bị bẻ cong lệch về gần pháp tuyến hơn so với tia tới (r₁ < i)',
      'Bị bẻ cong lệch ra xa pháp tuyến hơn so with tia tới (r₁ > i)',
      'Tiếp tục đi thẳng không đổi hướng',
      'Bị phản xạ ngược trở lại hoàn toàn',
    ],
    optionsEn: [
      'Bends toward the normal compared to incident ray (r₁ < i)',
      'Bends away from the normal compared to incident ray (r₁ > i)',
      'Continues straight without changing direction',
      'Reflects entirely backward',
    ],
    correctIndex: 0,
    explanationVi: 'Theo định luật khúc xạ ánh sáng: sin(i) = n·sin(r₁). Vì môi trường lăng kính chiết quang hơn không khí (n > 1) nên sin(r₁) < sin(i) ⇒ r₁ < i, tia khúc xạ lệch lại gần pháp tuyến.',
    explanationEn: 'By Snell\'s law: sin(i) = n·sin(r₁). Since glass is optically denser than air (n > 1), sin(r₁) < sin(i) ⇒ r₁ < i, so the ray bends toward the normal.',
  },
  {
    id: 3,
    questionVi: 'Vì sao ánh sáng trắng khi truyền qua lăng kính lại bị phân tách thành dải quang phổ nhiều màu (tán sắc)?',
    questionEn: 'Why does white light form a colorful spectrum when passing through a triangular prism (dispersion)?',
    optionsVi: [
      'Vì ánh sáng trắng gồm nhiều ánh sáng đơn sắc; lăng kính có chiết suất khác nhau với mỗi màu nên làm chúng lệch các góc khác nhau',
      'Vì lăng kính tự nhuộm màu cho ánh sáng khi ánh sáng đi xuyên qua thủy tinh',
      'Vì lăng kính làm tăng cường độ sáng của ánh sáng đỏ và giảm cường độ của ánh sáng tím',
      'Vì ánh sáng trắng bị nóng lên bên trong lăng kính và phát ra các màu sắc',
    ],
    optionsEn: [
      'Because white light contains many monochromatic colors; the prism has different refractive indices for each color, deviating them by different angles',
      'Because the prism dyes the light as it passes through the glass material',
      'Because the prism increases red intensity and decreases violet intensity',
      'Because white light heats up inside the prism and emits different colors',
    ],
    correctIndex: 0,
    explanationVi: 'Hiện tượng tán sắc chứng tỏ ánh sáng trắng là tập hợp của nhiều ánh sáng đơn sắc. Lăng kính không tạo ra màu mà chỉ tách các chùm tia đơn sắc vốn có vì mỗi màu bị khúc xạ với góc khác nhau.',
    explanationEn: 'Dispersion proves that white light is a mixture of monochromatic colors. The prism does not create colors; it merely separates existing components because each color refracts at a different angle.',
  },
  {
    id: 4,
    questionVi: 'Khi chiếu một chùm tia sáng đơn sắc (ví dụ ánh sáng đỏ từ đèn laser) qua lăng kính, kết quả quan sát được là gì?',
    questionEn: 'When a monochromatic light beam (e.g. red laser) passes through the prism, what is observed?',
    optionsVi: [
      'Tia sáng bị khúc xạ lệch hướng nhưng vẫn giữ nguyên màu đỏ, không bị phân tách thành nhiều màu',
      'Tia sáng đỏ bị biến đổi thành dải cầu vồng 7 màu',
      'Tia sáng bị hấp thụ hoàn toàn và biến mất',
      'Tia sáng đỏ bị đổi thành màu xanh lá cây',
    ],
    optionsEn: [
      'The ray refracts and deviates but remains red, without splitting into multiple colors',
      'The red ray transforms into a full 7-color rainbow spectrum',
      'The light ray is completely absorbed and disappears',
      'The red ray changes into green light',
    ],
    correctIndex: 0,
    explanationVi: 'Đặc điểm của ánh sáng đơn sắc: Có một bước sóng và tần số xác định, khi đi qua lăng kính chỉ bị khúc xạ (đổi hướng truyền) chứ không bị tán sắc.',
    explanationEn: 'Key feature of monochromatic light: It has a specific wavelength and frequency. Passing through a prism, it only refracts (changes direction) without dispersion.',
  },
  {
    id: 5,
    questionVi: 'Trong mô hình thủy tinh quang học thông thường, tia sáng màu nào bị lăng kính làm lệch nhiều nhất về phía đáy?',
    questionEn: 'In the standard optical glass model, which color ray is deviated most toward the prism base?',
    optionsVi: [
      'Tia tím (vì chiết suất của thủy tinh đối với ánh sáng tím là lớn nhất)',
      'Tia đỏ (vì chiết suất của thủy tinh đối với ánh sáng đỏ là lớn nhất)',
      'Tia vàng (vì màu vàng ở giữa quang phổ)',
      'Tia lục (vì mắt người nhạy cảm nhất với màu lục)',
    ],
    optionsEn: [
      'Violet ray (because glass refractive index is highest for violet light)',
      'Red ray (because glass refractive index is highest for red light)',
      'Yellow ray (because yellow is in the middle of the spectrum)',
      'Green ray (because human eyes are most sensitive to green)',
    ],
    correctIndex: 0,
    explanationVi: 'Chiết suất của thủy tinh tăng dần từ ánh sáng đỏ đến ánh sáng tím (n_tím > n_chàm > n_lam > n_lục > n_vàng > n_cam > n_đỏ). Do đó góc lệch D_tím lớn nhất và tia tím bị bẻ cong nhiều nhất về phía đáy lăng kính.',
    explanationEn: 'The refractive index of glass increases monotonically from red to violet (n_violet > n_indigo > n_blue > n_green > n_yellow > n_orange > n_red). Therefore, violet has the largest deviation angle D and bends most toward the base.',
  },
];

export const THEORY_HINTS = [
  {
    id: 1,
    titleVi: 'Gợi ý 1: Cấu tạo lăng kính và góc chiết quang',
    titleEn: 'Hint 1: Prism structure and apex angle',
    contentVi: 'Lăng kính là khối chất trong suốt, đồng tính (thủy tinh, nhựa trong...), thường có dạng lăng trụ tam giác. Góc hợp bởi hai mặt bên gọi là góc chiết quang A (trong thí nghiệm này A = 60°). Mặt còn lại là đáy lăng kính.',
    contentEn: 'A prism is a transparent, homogeneous medium (glass, clear acrylic), commonly shaped as a triangular prism. The angle between its two lateral faces is the apex angle A (A = 60° in this model). The bottom face is the prism base.',
  },
  {
    id: 2,
    titleVi: 'Gợi ý 2: Định luật khúc xạ ánh sáng tại hai mặt bên',
    titleEn: 'Hint 2: Refraction law at both lateral surfaces',
    contentVi: 'Tại mặt bên thứ nhất: tia sáng đi từ không khí vào thủy tinh, khúc xạ lại gần pháp tuyến (r₁ < i). Tại mặt bên thứ hai: tia sáng đi từ thủy tinh ra không khí, khúc xạ lệch ra xa pháp tuyến (e > r₂). Kết quả là tia ló luôn bị lệch về phía đáy lăng kính.',
    contentEn: 'At the first face: light enters glass from air and refracts toward the normal (r₁ < i). At the second face: light emerges from glass to air and refracts away from the normal (e > r₂). The emergent ray is consistently deflected toward the prism base.',
  },
  {
    id: 3,
    titleVi: 'Gợi ý 3: Bản chất hiện tượng tán sắc ánh sáng',
    titleEn: 'Hint 3: Nature of light dispersion',
    contentVi: 'Ánh sáng trắng không phải là ánh sáng đơn sắc mà là hỗn hợp của nhiều ánh sáng đơn sắc biến thiên liên tục từ đỏ đến tím. Lăng kính không tạo ra màu sắc mới mà chỉ tách các thành phần màu vốn có do chiết suất n_tím > n_đỏ.',
    contentEn: 'White light is not monochromatic; it is a blend of continuous monochromatic colors from red to violet. The prism does not produce new colors; it separates existing color components because n_violet > n_red.',
  },
  {
    id: 4,
    titleVi: 'Gợi ý 4: Ứng dụng thực tế - Cầu vồng tự nhiên',
    titleEn: 'Hint 4: Real-world application - Natural rainbows',
    contentVi: 'Sau cơn mưa, hàng triệu giọt nước li ti trong khí quyển đóng vai trò như những lăng kính tự nhiên nhỏ bé, khúc xạ, phản xạ toàn phần và tán sắc ánh sáng Mặt Trời tạo thành dải cầu vồng tuyệt đẹp trên bầu trời.',
    contentEn: 'After rain, millions of tiny water droplets in the atmosphere act as miniature natural prisms, refracting, internally reflecting, and dispersing sunlight into a stunning rainbow in the sky.',
  },
];
