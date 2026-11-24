import { installDebugRecorder } from '@webitel/ui-sdk/modules/DebugRecorder';

import { version } from '../../package.json' with { type: 'json' };

installDebugRecorder({
	app: 'crm',
	version,
});
