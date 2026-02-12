import {
	getDefaultGetListResponse,
	getDefaultGetParams,
	getDefaultInstance,
	getDefaultOpenAPIConfig,
} from '@webitel/api-services/api/defaults';
import {
	applyTransform,
	camelToSnake,
	merge,
	notify,
	sanitize,
	snakeToCamel,
	starToSearch,
} from '@webitel/api-services/api/transformers';
import type { ApiModule } from '@webitel/ui-sdk/src/api/types/ApiModule';
import { CaseCommentsApiFactory, CasesCaseComment } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const commentsService = CaseCommentsApiFactory(configuration, '', instance);

const getCommentsList = async ({ parentId, ...rest }) => {
	const { page, size, q, ids, sort, /*fields,*/ options } = applyTransform(
		rest,
		[
			merge(getDefaultGetParams()),
			starToSearch('search'),
			(params) => ({
				...params,
				q: params.search,
			}),
			camelToSnake(),
		],
	);
	try {
		const response = await commentsService.listComments(
			parentId,
			page,
			size,
			q,
			ids,
			sort,
			[
				'id',
				'etag',
				'text',
				'created_at',
				'updated_at',
				'created_by',
				'author',
				'can_edit',
				'edited',
			],
			options,
		);

		const { items, next } = applyTransform(response.data, [
			merge(getDefaultGetListResponse()),
		]);
		return {
			items: applyTransform(items, [
				snakeToCamel(),
			]),
			next,
		};
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const addComment = async ({ parentId, input }) => {
	try {
		const response = await commentsService.publishComment(parentId, input);
		return applyTransform(response.data, [
			snakeToCamel(),
		]);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const patchComment = async ({ commentId, changes }) => {
	const fieldsToSend = [
		'text',
	];
	const body = applyTransform(changes, [
		sanitize(fieldsToSend),
		camelToSnake(),
	]);

	try {
		const response = await commentsService.updateComment(commentId, body);
		return applyTransform(response.data, [
			snakeToCamel(),
		]);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const deleteComment = async ({ etag }) => {
	try {
		const response = await commentsService.deleteComment(etag);
		return applyTransform(response.data, []);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

export const CommentsAPI: ApiModule<CasesCaseComment> = {
	getList: getCommentsList,
	delete: deleteComment,
	add: addComment,
	patch: patchComment,
};

export default CommentsAPI;
