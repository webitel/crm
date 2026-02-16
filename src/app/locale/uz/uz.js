import {
	ContactsGroupType,
	WebitelCasesRelationType,
	WebitelCasesSourceType,
} from '@webitel/api-services/gen/models';
import { ChatGatewayProvider, CrmSections } from '@webitel/ui-sdk/enums';

import { SearchMode } from '../../../modules/cases/enums/SearchMode.ts';
import AccessMode from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import { TimelineEventType } from '../../../modules/timeline/enums/TimelineEventType';
import TimelineTaskStatusEnum from '../../../modules/timeline/enums/TimelineTaskStatus.enum.js';

export default {
	crm: 'CRM',
	contacts: {
		contact: 'Kontakt | Kontaktlar',
		manager: 'Egasi | Egalari',
		destination: "Yo'nalish",
		collapseAll: "Hammasini yig'ish",
		allContacts: ({ linked }) =>
			`${linked('reusable.all')} ${linked(`vocabulary.contact`).toLowerCase()}`,
		addContacts: ({ linked }) =>
			`${linked('reusable.add')} ${linked(`vocabulary.contact`).toLowerCase()}`,
		communications: {
			communications: 'Aloqa varianti | Aloqa variantlari',
			channel: 'Kanal',
			destination: "Yo'nalish",
			setAsPrimary: 'Asosiy sifatida belgilash',
			emails: {
				addTitle: "Emailni qo'shish",
				editTitle: 'Emailni tahrirlash',
				dummy: "Hali email manzillari yo'q",
			},
			phones: {
				addTitle: "Telefon raqamini qo'shish",
				editTitle: 'Telefon raqamini tahrirlash',
				dummy: "Hali telefon raqamlari yo'q",
			},
			messaging: {
				gateway: 'Shlyuz',
				provider: 'Provider',
				username: 'Foydalanuvchi nomi',
				dummy: "Hali xabar almashish variantlari yo'q",
				sendMessage: 'Xabar yuborish',
				messengers: {
					[ChatGatewayProvider.TELEGRAM_BOT]: 'Telegram Bot',
					[ChatGatewayProvider.TELEGRAM_APP]: 'Telegram Ilova',
					[ChatGatewayProvider.MESSENGER]: 'Meta',
					[ChatGatewayProvider.VIBER]: 'Viber',
					[ChatGatewayProvider.WEBCHAT]: 'Web chat',
					[ChatGatewayProvider.INFOBIP]: 'Infobip',
					[ChatGatewayProvider.CUSTOM]: 'Maxsus Chat Shlyuzi',
					[ChatGatewayProvider.PORTAL]: 'Portal',
				},
			},
		},
		details: 'Tafsilotlar',
		attributes: 'Atribut | Atributlar',
	},
	timeline: {
		timeline: "Vaqt chizig'i",
		totalDuration: 'Umumiy davomiyligi',
		actions: {
			openInHistory: 'Tarixda ochish',
			playRecording: 'Yozuvni ijro etish',
			transcription: 'Transkripsiya',
		},
		status: {
			[TimelineTaskStatusEnum.STARTED]: 'Boshlandi',
			[TimelineTaskStatusEnum.MISSED]: "O'tkazib yuborildi",
			[TimelineTaskStatusEnum.TRANSFERRED]: "O'tkazildi",
			[TimelineTaskStatusEnum.ENDED]: 'Tugadi',
			[TimelineTaskStatusEnum.SENT]: 'Yuborildi',
			[TimelineTaskStatusEnum.RECEIVED]: 'Qabul qilindi',
		},
		eventType: {
			[TimelineEventType.Call]: "Qo'ng'iroq | Qo'ng'iroqlar",
			[TimelineEventType.Chat]: 'Chat | Chatlar',
			[TimelineEventType.Email]: 'Email | Emaillar',
		},
		emails: {
			to: 'Kimga',
			cc: 'CC',
			subject: 'Mavzu',
		},
	},
	permissions: {
		read: "O'qish",
		edit: 'Tahrirlash',
		delete: "O'chirish",
		granteePopup: {
			title: "Huquq oluvchini qo'shish",
		},
		accessMode: {
			[AccessMode.ALLOW]: 'Ruxsat berish',
			[AccessMode.FORBIDDEN]: 'Taqiqlangan',
			[AccessMode.MANAGE]: 'Delegatsiya bilan ruxsat berish',
		},
	},
	startPage: {
		[CrmSections.Contacts]: {
			name: 'Kontaktlar',
			text: "Ushbu bo'limda siz kontaktlaringiz bilan ishlashingiz mumkin: mijozlar, xaridorlar va hokazo.",
		},
		[CrmSections.Cases]: {
			name: 'Murojaat',
			text: "Bu yerda siz tizimda ro'yxatdan o'tgan Murojaatlarni ko'rishingiz mumkin.",
		},
		configuration: {
			name: 'Sozlamalar',
			text: "Bu bo'limda siz Murojaatlar boshqaruvi jarayonini sozlaysiz.",
		},
	},
	lookups: {
		lookups: "Ma'lumotnomalar",
		slas: {
			slas: 'SLA | SLAlar',
			conditions: 'Shart | Shartlar',
			editCondition: 'Shartni tahrirlash',
			addCondition: "Shart qo'shish",
			reactionTime: 'Reaktsiya vaqti',
			reactionTimeTitle: 'Reaktsiya vaqti (kk:ss:dd)',
			resolutionTime: 'Yechim vaqti',
			resolutionTimeTitle: 'Yechim vaqti (kk:ss:dd)',
			validFrom: 'Amal qilish muddati',
			validTo: 'Tugash muddati',
			error: {
				duplicateConditionName: 'Bunday nomli shart allaqachon mavjud',
			},
		},
		sources: {
			sources: 'Murojaat manbasi | Murojaat manbalari',
			types: {
				[WebitelCasesSourceType.Call]: "Qo'ng'iroq",
				[WebitelCasesSourceType.Chat]: 'Chat',
				[WebitelCasesSourceType.SocialMedia]: 'Ijtimoiy tarmoq',
				[WebitelCasesSourceType.Email]: 'Email',
				[WebitelCasesSourceType.Api]: 'API',
				[WebitelCasesSourceType.Manual]: "Qo'lda",
			},
		},
		serviceCatalogs: {
			serviceCatalogs: 'Xizmatlar katalogi | Xizmatlar kataloglari',
			prefix: 'Prefiks',
			code: 'Kod',
			statuses: ({ linked }) => linked(`lookups.statuses.statuses`, 2),
			skills: "Ko'nikmalar",
		},
		service: {
			service: 'Xizmat | Xizmatlar',
		},
		contactGroups: {
			contactGroups: 'Kontakt guruhi | Kontakt guruhlari',
			defaultGroup: 'Standart guruh',
			addGroup: "Guruh qo'shish",
			assignee: "Mas'ul",
			types: {
				[ContactsGroupType.Dynamic]: 'Dinamik',
				[ContactsGroupType.Static]: 'Statik',
			},
		},
		closeReasonGroups: {
			closeReasonGroups: 'Yopish sabablari',
			reason: 'Sabab | Sabablar',
			addReason: "Sabab qo'shish",
			editReason: 'Sabab tahrirlash',
			sameConditionError: 'Bunday shart allaqachon mavjud',
		},
		statuses: {
			statuses: 'Status | Statuslar',
			initial: "Boshlang'ich",
			final: 'Yakuniy',
			addStatus: ({ linked }) =>
				`${linked('reusable.add')} ${linked(
					`lookups.statuses.statuses`,
					1,
				).toLowerCase()}`,
			editStatus: ({ linked }) =>
				`${linked('reusable.edit')} ${linked(
					`lookups.statuses.statuses`,
					1,
				).toLowerCase()}`,
			statusType: 'Status turi',
			finalStatusValidationText:
				"Kamida bitta yakuniy status va faqat bitta boshlang'ich status bo'lishi kerak.\n Iltimos, qaytib uning turini tekshiring.",
		},
	},
	customization: {
		customLookups: {
			allValues: 'Barcha qiymatlar',
			code: 'Kod',
			columns: 'Ustunlar',
			addColumn: "Ustun qo'shish",
			editColumn: 'Ustunni tahrirlash',
			defaultValue: 'Standart qiymat',
			confirmDeleteColumn:
				"Ustunni o'chirgandan va saqlagandan so'ng, tegishli maydondagi barcha kiritilgan ma'lumotlar ham o'chiriladi.",
			controlPermissions: 'Huquqlarni boshqarish',
			field: {
				id: 'ID',
				name: ({ linked }) => linked('reusable.name'),
				createdAt: ({ linked }) => linked('reusable.createdAt'),
				createdBy: ({ linked }) => linked('reusable.createdBy'),
				modifiedAt: ({ linked }) => linked('reusable.modifiedAt'),
				modifiedBy: ({ linked }) => linked('reusable.modifiedBy'),
			},
			fieldType: {
				string: 'Matn',
				int32: 'Raqam',
				int64: 'Raqam',
				lookup: 'Tanlash',
				list: "Ko'p tanlash",
				datetime: 'Kalendar',
				bool: 'Mantiqiy',
			},
		},
		extensions: {
			contacts: ({ linked }) => linked('contacts.contact'),
			cases: ({ linked }) => linked('cases.case'),
		},
	},
	cases: {
		case: 'Murojaat | Murojaatlar',
		id: 'ID',
		subject: 'Mavzu',
		priority: 'Muhimlik',
		status: 'Status',
		source: 'Manba',
		author: 'Muallif',
		service: '@:lookups.service.service',
		assignee: '@:lookups.contactGroups.assignee',
		reporter: 'Xabar beruvchi',
		impacted: "Ta'sirlangan",
		appliedSLA: "Qo'llanilgan SLA",
		appliedCondition: "Qo'llanilgan shart",
		reactionTime: '@:lookups.slas.reactionTime',
		resolutionTime: '@:lookups.slas.resolutionTime',
		actualReactionTime: 'Haqiqiy reaktsiya vaqti',
		actualResolutionTime: 'Haqiqiy yechim vaqti',
		closureReason: 'Yopish sababi',
		result: 'Natija',
		rating: 'Reyting',
		persons: 'Shaxslar',
		selectAService: 'Xizmatni tanlang',
		deadlines: 'Muddatlar',
		ratingComment: 'Reyting izohi',
		caseResult: 'Murojaat natijasi',
		assignToMe: "O'zimga biriktirish",
		company: 'Kompaniya',
		department: "Bo'lim",
		position: 'Lavozim',
		location: 'Joylashuv',
		serviceValidation: 'Iltimos, avval xizmatni tanlang',
		caseNumber: 'Murojaat raqami',
		caseInfo: {
			caseInfo: "Murojaat ma'lumoti",
			contactInfo: "Kontakt ma'lumoti",
		},
		comments: {
			comments: 'Izohlar',
			edited: 'Tahrirlangan',
			yourCommentHere: 'Izohingizni shu yerga yozing',
			emptyText: "Hali izohlar yo'q",
		},
		attachments: {
			attachments: 'Ilovalar',
			files: 'Fayllar',
			links: 'Havolalar',
			url: 'URL',
			linkText: 'Havola matni',
			emptyFilesText: "Hali ilovalar yo'q",
			emptyLinksText: "Hali havolalar yo'q",
		},
		details: {
			details: 'Tafsilotlar',
		},
		relatedCases: {
			relatedCases: "Bog'liq murojaatlar",
			emptyText: "Hali bog'liq murojaatlar yo'q",
			searchCasesPlaceholder: 'Murojaat qidirish',
			relationType: {
				[WebitelCasesRelationType.Duplicates]: 'dublikati',
				[WebitelCasesRelationType.IsDuplicatedBy]: "dublikati bo'lgan",
				[WebitelCasesRelationType.Blocks]: 'bloklaydi',
				[WebitelCasesRelationType.IsBlockedBy]: 'bloklanadi',
				[WebitelCasesRelationType.Causes]: 'sababi',
				[WebitelCasesRelationType.IsCausedBy]: "sababi bo'lgan",
				[WebitelCasesRelationType.IsChildOf]: 'ning bolasi',
				[WebitelCasesRelationType.IsParentOf]: 'ning otasi',
				[WebitelCasesRelationType.RelatesTo]: "bog'liq",
			},
		},
		slaRecalculationPopup: {
			title: 'SLA qayta hisoblash',
			message:
				"Xizmatni o'zgartirgandan va saqlagandan so'ng, Murojaatning SLA qayta hisoblanadi.",
		},
	},
	filters: {
		search: {
			[SearchMode.Search]: 'Oddiy qidiruv',
			[SearchMode.Fts]: "To'liq matn qidirish",
		},
	},
};
