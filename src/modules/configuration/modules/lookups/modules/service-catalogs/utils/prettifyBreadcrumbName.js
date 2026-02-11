const prettifyBreadcrumbName = (name) => {
	if (name?.length > 25) {
		return name.substring(0, 22) + '...';
	}

	return name;
};

export default prettifyBreadcrumbName;
