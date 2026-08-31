import type { WebitelContactsContact } from '@webitel/api-services/gen/models';
import { shallowMount } from '@vue/test-utils';

import OpenedContactGeneral from '../opened-contact-general.vue';

const mountWithAccess = (modelValue: WebitelContactsContact) =>
	shallowMount(OpenedContactGeneral, {
		props: {
			modelValue,
		},
		global: {
			provide: {
				access: {
					value: {
						hasRbacEditAccess: true,
						hasRbacDeleteAccess: true,
					},
				},
			},
		},
	});

describe('OpenedContactGeneral', () => {
	it('renders the contact display name', () => {
		const wrapper = mountWithAccess({
			name: {
				commonName: 'Jest Doe',
			},
		});

		expect(wrapper.isVisible()).toBe(true);
		expect(wrapper.text()).toContain('Jest Doe');
	});

	it('joins multiple group names, dropping blank ones', () => {
		const wrapper = mountWithAccess({
			name: {
				commonName: 'Jest Doe',
			},
			groups: {
				data: [
					{
						group: {
							name: 'VIP',
						},
					},
					{
						group: {
							name: '',
						},
					},
					{
						group: {
							name: 'Support',
						},
					},
				],
			},
		});

		expect(wrapper.text()).toContain('VIP, Support');
	});

	it('renders one chip per label', () => {
		const wrapper = mountWithAccess({
			name: {
				commonName: 'Jest Doe',
			},
			labels: {
				data: [
					{
						id: '1',
						label: 'urgent',
					},
					{
						id: '2',
						label: 'follow-up',
					},
				],
			},
		});

		expect(
			wrapper.findAllComponents({
				name: 'WtChip',
			}),
		).toHaveLength(2);
	});

	it('renders without groups, labels or a name set', () => {
		const wrapper = mountWithAccess({});

		expect(wrapper.isVisible()).toBe(true);
	});
});
