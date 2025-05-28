(function () {
	const scriptTag = document.currentScript;
	const businessId = scriptTag.getAttribute('data-business-id');
	const containerId = scriptTag.getAttribute('data-container-id') || 'rating-widget';
	if (!businessId) {
		console.error('Business ID is required.');
		return;
	}

	fetch(
		`https://phpstack-1250693-5033752.cloudwaysapps.com/api/v1/business/info/${businessId}`,
	)
		.then((response) => response.json())
		.then((data) => {
			const business = data.payload;
			const widgetContainer = document.getElementById(containerId);
			if (widgetContainer) {
				const renderStars = (rating) => {
					let stars = '';

					for (let i = 1; i <= rating; i++) {
						if (i === 1) {
							stars += `<rect x="0.735107" y="0.213623" width="21" height="21" rx="2.625" fill="#4558F9"/>
                          <path d="M11.0415 3.03223L12.766 8.33991H18.3469L13.8319 11.6202L15.5564 16.9279L11.0415 13.6476L6.52647 16.9279L8.25105 11.6202L3.73606 8.33991H9.31689L11.0415 3.03223Z" fill="#EAF0F8"/>`;
						} else if (i === 2) {
							stars += `<rect x="24.3601" y="0.213623" width="21" height="21" rx="2.625" fill="#4558F9"/>
                          <path d="M34.6665 3.03223L36.391 8.33991H41.9719L37.4569 11.6202L39.1814 16.9279L34.6665 13.6476L30.1515 16.9279L31.876 11.6202L27.3611 8.33991H32.9419L34.6665 3.03223Z" fill="#EAF0F8"/>`;
						} else if (i === 3) {
							stars += `<rect x="47.9851" y="0.213623" width="21" height="21" rx="2.625" fill="#4558F9"/>
                          <path d="M58.2915 3.03223L60.016 8.33991H65.5969L61.0819 11.6202L62.8064 16.9279L58.2915 13.6476L53.7765 16.9279L55.501 11.6202L50.9861 8.33991H56.5669L58.2915 3.03223Z" fill="#EAF0F8"/>`;
						} else if (i === 4) {
							stars += `<rect x="71.6101" y="0.213623" width="21" height="21" rx="2.625" fill="#4558F9"/>
                          <path d="M81.9165 3.03223L83.641 8.33991H89.2219L84.7069 11.6202L86.4314 16.9279L81.9165 13.6476L77.4015 16.9279L79.126 11.6202L74.6111 8.33991H80.1919L81.9165 3.03223Z" fill="#EAF0F8"/>`;
						} else if (i === 5) {
							stars += `<rect x="95.2354" y="0.213623" width="21" height="21" rx="2.625" fill="#4558F9"/>
                          <path d="M105.541 3.03223L107.266 8.33991H112.847L108.332 11.6202L110.056 16.9279L105.541 13.6476L101.026 16.9279L102.751 11.6202L98.2361 8.33991H103.817L105.541 3.03223Z" fill="#EAF0F8"/>`;
						}
					}
					return stars;
				};

				widgetContainer.innerHTML = `
				<div style="font-family: 'Poppins', sans-serif;width: 20%; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 16px; display: flex; flex-direction: column; gap: 12px;">
					<div style="border-radius: 8px; background-color: #e5e7eb; display: flex; align-items: center; justify-content: center;">
						${business.image ? `<img src="https://phpstack-1250693-5033752.cloudwaysapps.com/public/${business.image}" width="100%" style="border-radius: 10px" alt="${business.name} image">` : ''}
					</div>
					<div>
						<h2 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0;">${business.name}</h2>
						<p style="font-size: 14px; color: #3b82f6; margin: 4px 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
							<a href="${business.website}" target="_blank" style="text-decoration: none; color: inherit;">${business.website}</a>
						</p>
					</div>
					<div style="display: flex; align-items: center; gap: 10px;">
						<div style="display: flex; align-items: center; gap: 5px;">
							${
								business?._count?.reviews > 0
									? `
									<div style="display: flex; gap: 2px; color: #f59e0b;">
										<svg width="117" height="22" viewBox="0 0 117 22" fill="none" xmlns="http://www.w3.org/2000/svg">
											${renderStars(Math.round(business.rating))}
										</svg>
									</div>
									<p style="font-size: 14px; color: #4b5563; margin: 0;">${business.rating}/5.0 (${business._count.reviews})</p>
								`
									: '<p style="font-size: 14px; color: #4b5563; margin: 0;">Asking for reviews</p>'
							}
							
						</div>
					</div>
					<div>
						<a href="http://192.168.88.31:5173/listing/listing-detail/${business.id}" style="color: #3b82f6; text-decoration: none; font-size: 14px; display: flex; align-items: center; gap: 6px;">
							View Details
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 10-1.414 1.414L13.586 10H4a1 1 0 100 2h9.586l-3.293 3.293a1 1 0 000 1.414z" clip-rule="evenodd"/>
							</svg>
						</a>
					</div>
				</div>
			`;
			}
		})
		.catch((error) => {
			console.error('Error fetching rating:', error);
		});
})();
