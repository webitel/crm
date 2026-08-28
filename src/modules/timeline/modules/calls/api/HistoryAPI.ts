import { CallHistoryAPI } from '@webitel/api-services/api';
import { applyTransform } from '@webitel/api-services/api/transformers';

import { TimelineMode } from '../../../enums/TimelineMode';

/** `variables` keys are user-defined, so they skip both case transformers. */
const doNotConvertKeys = [
	'variables',
];

const getList =
	({ paramsTransformers = [], responseItemsTransformers = [] }) =>
	async (params) => {
		const {
			page,
			size,
			from,
			to,
			user,
			rated,
			ratedBy,
			agent,
			queue,
			team,
			gateway,
			member,
			duration,
			skipParent,
			parentId,
			cause,
			fields = [
				'id',
				'to',
				'duration',
				'created_at',
			],
			sort = '-created_at',
			direction,
			search,
			id,
			dependencyId,
			tags,
			amdResult,
			fts,
			hangupDisposition,
			hasFile,
			hasTranscription,
			hasTransfer,
			description,
			grantee,
			score,
			variable,
			contact,
		} = applyTransform(params, paramsTransformers);

		const variables = variable?.split('&').reduce((vars, currVar) => {
			const [key, value] = currVar.split('=');
			/*
				 This if else statement is needed for sending ''
				  to backend when user writes not valid variableSearch, so we can display dummy image.
				 */
			vars[key] = value !== undefined ? value : '';
			return vars;
		}, {});

		const data = {
			page,
			size,
			sort,
			fields,
			created_at: {
				from,
				to,
			},
			user_id: user,
			agent_id: agent,
			queue_id: queue,
			team_id: team,
			member_id: member,
			gateway_id: gateway,
			has_transfer: hasTransfer,
			duration,
			skip_parent: skipParent,
			parent_id: parentId,
			cause,
			has_file:
				hasFile === 'true' ? true : hasFile === 'false' ? false : undefined,
			number: search,
			direction,
			id,
			dependency_id: dependencyId,
			tags,
			amd_result: amdResult,
			fts,
			directions: hangupDisposition,
			has_transcript:
				hasTranscription === 'true'
					? true
					: hasTranscription === 'false'
						? false
						: undefined,
			agent_description: description,
			grantee_id: grantee,
			rated: rated === 'true' ? true : rated === 'false' ? false : undefined,
			rated_by: ratedBy,
			score_required: score,
			variables,
			contact_id: contact,
			timeline: true,
		};

		const { items, next } = await CallHistoryAPI.getListPost({
			data,
			doNotConvertKeys,
		});
		return {
			items: applyTransform(items, responseItemsTransformers).reverse(),
			next,
		};
	};

const getHistory = getList({
	paramsTransformers: [],
	responseItemsTransformers: [],
});

const ModeApiMap = {
	[TimelineMode.Contact]: {
		getList: ({ taskId }) =>
			getHistory({
				dependencyId: taskId,
				hasTransfer: true,
			}),
	},
	[TimelineMode.Case]: {
		getList: ({ taskId }) =>
			getHistory({
				dependencyId: taskId,
				hasTransfer: true,
			}),
	},
};

export default {
	getList: ({ mode, ...rest }) => ModeApiMap[mode].getList(rest),
};
