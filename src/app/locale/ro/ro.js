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
		contact: 'Contact | Contacte',
		manager: 'Proprietar | Proprietari',
		destination: 'Destinație',
		collapseAll: 'Restrânge tot',
		allContacts: ({ linked }) =>
			`${linked('reusable.all')} ${linked(`vocabulary.contact`).toLowerCase()}`,
		addContacts: ({ linked }) =>
			`${linked('reusable.add')} ${linked(`vocabulary.contact`).toLowerCase()}`,
		communications: {
			communications: 'Opțiune de comunicare | Opțiuni de comunicare',
			channel: 'Canal',
			destination: 'Destinație',
			setAsPrimary: 'Setează ca principal',
			emails: {
				addTitle: 'Adaugă email',
				editTitle: 'Editează email',
				dummy: 'Nu există adrese de email încă',
			},
			phones: {
				addTitle: 'Adaugă număr de telefon',
				editTitle: 'Editează număr de telefon',
				dummy: 'Nu există numere de telefon încă',
			},
			messaging: {
				gateway: 'Gateway',
				provider: 'Furnizor ',
				username: 'Nume utilizator',
				dummy: 'Nu există opțiuni de mesagerie încă',
				sendMessage: 'Trimite mesaj',
				messengers: {
					[ChatGatewayProvider.TELEGRAM_BOT]: 'Telegram Bot',
					[ChatGatewayProvider.TELEGRAM_APP]: 'Telegram App',
					[ChatGatewayProvider.MESSENGER]: 'Meta',
					[ChatGatewayProvider.VIBER]: 'Viber',
					[ChatGatewayProvider.WEBCHAT]: 'Chat web',
					[ChatGatewayProvider.INFOBIP]: 'Infobip',
					[ChatGatewayProvider.CUSTOM]: 'Gateway de chat personalizat',
					[ChatGatewayProvider.PORTAL]: 'Portal',
				},
			},
		},
		details: 'Detalii',
		attributes: 'Atribut | Atribute',
	},
	timeline: {
		timeline: 'Cronologie',
		totalDuration: 'Durată totală',
		actions: {
			openInHistory: 'Deschide în istoric',
			playRecording: 'Redă înregistrarea',
			transcription: 'Transcriere',
		},
		status: {
			[TimelineTaskStatusEnum.STARTED]: 'Început',
			[TimelineTaskStatusEnum.MISSED]: 'Ratat',
			[TimelineTaskStatusEnum.TRANSFERRED]: 'Transferat',
			[TimelineTaskStatusEnum.ENDED]: 'Încheiat',
			[TimelineTaskStatusEnum.SENT]: 'Trimis',
			[TimelineTaskStatusEnum.RECEIVED]: 'Primit',
		},
		eventType: {
			[TimelineEventType.Call]: 'Apel | Apeluri',
			[TimelineEventType.Chat]: 'Chat | Chat-uri',
			[TimelineEventType.Email]: 'Email | Email-uri',
		},
		emails: {
			to: 'Către',
			cc: 'CC',
			subject: 'Subiect',
		},
	},
	permissions: {
		read: 'Citire',
		edit: 'Editare',
		delete: 'Ștergere',
		granteePopup: {
			title: 'Adaugă beneficiar',
		},
		accessMode: {
			[AccessMode.ALLOW]: 'Permite',
			[AccessMode.FORBIDDEN]: 'Interzis',
			[AccessMode.MANAGE]: 'Permite cu delegare',
		},
	},
	startPage: {
		[CrmSections.Contacts]: {
			name: 'Contacte',
			text: 'În această secțiune, poți lucra cu contactele tale: clienți, consumatori etc.',
		},
		[CrmSections.Cases]: {
			name: 'Cazuri',
			text: 'Aici poți vizualiza Cazurile înregistrate în sistem.',
		},
		configuration: {
			name: 'Configurație',
			text: 'În această secțiune, vei configura procesul de gestionare a Cazurilor.',
		},
	},
	lookups: {
		lookups: 'Căutări',

		slas: {
			slas: 'SLA | SLA-uri',
			conditions: 'Condiție | Condiții',
			editCondition: 'Editează condiția',
			addCondition: 'Adaugă condiție',
			reactionTime: 'Timp de reacție',
			reactionTimeTitle: 'Timp de reacție (zz:hh:mm)',
			resolutionTime: 'Timp de rezolvare',
			resolutionTimeTitle: 'Timp de rezolvare (zz:hh:mm)',
			validFrom: 'Valid de la',
			validTo: 'Valid până la',
			error: {
				duplicateConditionName: 'O condiție cu acest nume există deja',
			},
		},

		sources: {
			sources: 'Sursă caz | Surse cazuri',
			types: {
				[WebitelCasesSourceType.Call]: 'Apel',
				[WebitelCasesSourceType.Chat]: 'Chat',
				[WebitelCasesSourceType.SocialMedia]: 'Social Media',
				[WebitelCasesSourceType.Email]: 'Email',
				[WebitelCasesSourceType.Api]: 'API',
				[WebitelCasesSourceType.Manual]: 'Manual',
			},
		},

		serviceCatalogs: {
			serviceCatalogs: 'Catalog servicii | Cataloage servicii',
			prefix: 'Prefix',
			code: 'Cod',
			statuses: ({ linked }) => linked(`lookups.statuses.statuses`, 2),
			skills: 'Abilități',
		},

		service: {
			service: 'Serviciu | Servicii',
		},

		contactGroups: {
			contactGroups: 'Grup contact | Grupuri contacte',
			defaultGroup: 'Grup implicit',
			addGroup: 'Adaugă grup',
			assignee: 'Responsabil',
			types: {
				[ContactsGroupType.Dynamic]: 'Dinamic',
				[ContactsGroupType.Static]: 'Static',
			},
		},

		closeReasonGroups: {
			closeReasonGroups: 'Motive închidere',
			reason: 'Motiv | Motive',
			addReason: 'Adaugă motiv',
			editReason: 'Editează motiv',
			sameConditionError: 'O astfel de condiție există deja',
		},

		statuses: {
			statuses: 'Status | Statusuri',
			initial: 'Inițial',
			final: 'Final',
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
			statusType: 'Tip status',
			finalStatusValidationText:
				'Ar trebui să aveți cel puțin un status final și doar unul inițial.\n Vă rugăm să reveniți și să verificați tipul acestuia.',
		},
	},
	customization: {
		customLookups: {
			allValues: 'Toate valorile',
			code: 'Cod',
			columns: 'Coloane',
			addColumn: 'Adaugă coloană',
			editColumn: 'Editează coloană',
			defaultValue: 'Valoare implicită',
			confirmDeleteColumn:
				'După ștergerea coloanei și salvare, toate datele introduse în câmpul corespunzător vor fi șterse de asemenea.',
			controlPermissions: 'Control permisiuni',
			field: {
				id: 'ID',
				name: ({ linked }) => linked('reusable.name'),
				createdAt: ({ linked }) => linked('reusable.createdAt'),
				createdBy: ({ linked }) => linked('reusable.createdBy'),
				modifiedAt: ({ linked }) => linked('reusable.modifiedAt'),
				modifiedBy: ({ linked }) => linked('reusable.modifiedBy'),
			},
			fieldType: {
				string: 'Text',
				int32: 'Număr',
				int64: 'Număr',
				lookup: 'Selectare',
				list: 'Selectare multiplă',
				datetime: 'Calendar',
				bool: 'Boolean',
			},
		},
		extensions: {
			contacts: ({ linked }) => linked('contacts.contact'),
			cases: ({ linked }) => linked('cases.case'),
		},
	},
	cases: {
		case: 'Caz | Cazuri',
		id: 'ID',
		subject: 'Subiect',
		priority: 'Prioritate',
		status: 'Status',
		source: 'Sursă',
		author: 'Autor',
		service: '@:lookups.service.service',
		assignee: '@:lookups.contactGroups.assignee',
		reporter: 'Raportor',
		impacted: 'Afectat',
		appliedSLA: 'SLA aplicat',
		appliedCondition: 'Condiție aplicată',
		reactionTime: '@:lookups.slas.reactionTime',
		resolutionTime: '@:lookups.slas.resolutionTime',
		actualReactionTime: 'Timp real de reacție',
		actualResolutionTime: 'Timp real de rezolvare',
		closureReason: 'Motiv închidere',
		result: 'Rezultat',
		rating: 'Evaluare',
		persons: 'Persoane',
		selectAService: 'Selectează un serviciu',
		deadlines: 'Termene limită',
		ratingComment: 'Comentariu evaluare',
		caseResult: 'Rezultat caz',
		assignToMe: 'Atribuie-mi',
		company: 'Companie',
		department: 'Departament',
		position: 'Poziție',
		location: 'Locație',
		serviceValidation: 'Vă rugăm să selectați mai întâi un serviciu',
		caseNumber: 'Număr caz',
		caseInfo: {
			caseInfo: 'Informații caz',
			contactInfo: 'Informații contact',
		},
		comments: {
			comments: 'Comentarii',
			edited: 'Editat',
			yourCommentHere: 'Comentariul tău aici',
			emptyText: 'Nu există comentarii încă',
		},
		attachments: {
			attachments: 'Atașamente',
			files: 'Fișiere',
			links: 'Link-uri',
			url: 'URL',
			linkText: 'Text link',
			emptyFilesText: 'Nu există atașamente încă',
			emptyLinksText: 'Nu există link-uri încă',
		},
		details: {
			details: 'Detalii',
		},
		relatedCases: {
			relatedCases: 'Cazuri conexe',
			emptyText: 'Nu există cazuri conexe încă',
			searchCasesPlaceholder: 'Caută un caz',
			relationType: {
				[WebitelCasesRelationType.Duplicates]: 'dublează',
				[WebitelCasesRelationType.IsDuplicatedBy]: 'este dublat de',
				[WebitelCasesRelationType.Blocks]: 'blochează',
				[WebitelCasesRelationType.IsBlockedBy]: 'este blocat de',
				[WebitelCasesRelationType.Causes]: 'cauzează',
				[WebitelCasesRelationType.IsCausedBy]: 'este cauzat de',
				[WebitelCasesRelationType.IsChildOf]: 'este copil al',
				[WebitelCasesRelationType.IsParentOf]: 'este părinte al',
				[WebitelCasesRelationType.RelatesTo]: 'este legat de',
			},
		},
		slaRecalculationPopup: {
			title: 'Recalculare SLA',
			message:
				'După modificarea serviciului și salvare, SLA-ul Cazului va fi recalculat.',
		},
	},
	filters: {
		search: {
			[SearchMode.Search]: 'Căutare obișnuită',
			[SearchMode.Fts]: 'Căutare în text complet',
		},
	},
};
