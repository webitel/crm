import { getDefaultGetListResponse } from '@webitel/ui-sdk/src/api/defaults';
import {
  merge,
  notify,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers';
import applyTransform
  from '@webitel/ui-sdk/src/api/transformers/applyTransform';
import { CallServiceApiFactory } from 'webitel-sdk';
import instance from '../../../../../../../app/api/instance.js';
import configuration from '../../../../../../../app/api/openAPIConfig.js';

const callService = new CallServiceApiFactory(configuration, '', instance);

const getList = ({
                   paramsTransformers = [],
                   responseTransformers = [],
                   responseItemsTransformers = [],
                 }) => async (params) => {
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
    fields = ['to', 'transfer_to', 'created_at', 'duration'],
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
    description,
    grantee,
    talkSec,
    score,
    variable,
    contact,
  } = applyTransform(params, paramsTransformers);
  try {
    const variables = variable
      && variable.split('&')
      .reduce((vars, currVar) => {
        const [key, value] = currVar.split('=');
        return {
          ...vars,
          /*
           This if else statement is needed for sending ''
            to backend when user writes not valid variableSearch, so we can display dummy image.
           */
          [key]: value !== undefined ? value : '',
        };
      }, {});

    const response = await callService.searchHistoryCallPost({
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
      duration,
      skip_parent: skipParent,
      parent_id: parentId,
      cause,
      has_file: hasFile === 'true' ? true : hasFile === 'false'
        ? false
        : undefined,
      number: search,
      direction,
      id,
      dependency_id: dependencyId,
      tags,
      amd_result: amdResult,
      fts,
      directions: hangupDisposition,
      has_transcript: hasTranscription === 'true' ? true : hasTranscription ===
      'false' ? false : undefined,
      agent_description: description,
      grantee_id: grantee,
      talk: talkSec,
      rated: rated === 'true' ? true : rated === 'false' ? false : undefined,
      rated_by: ratedBy,
      score_required: score,
      variables,
      contact_id: contact,
    });
    const {
      items,
      next,
    } = applyTransform(response.data, responseTransformers);
    return {
      items: applyTransform(items, responseItemsTransformers).reverse(),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const getHistory = getList({
  paramsTransformers: [],
  responseTransformers: [
    snakeToCamel(['variables']),
    merge(getDefaultGetListResponse()),
  ],
  responseItemsTransformers: [
    (items) => {
      // filter calls, received transfer - we need only calls that ended by transfer
      return items.filter(({ transferTo }) => !!transferTo);
    },
  ],
});

export default {
  getList: getHistory,
};
