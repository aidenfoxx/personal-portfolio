/**
 * Function overrides.
 */
GaussianBackground.prototype.changeLayerColors = function(colors) {
	this.layers[0].color = colors[0];
	this.layers[1].color = colors[1];
	this.layers[2].color = colors[2];
	this.layers[3].color = colors[3];
}

AltScroll.prototype.resizeCallback = function()
{
    this.hideScrollbars();

    // Little hack to ensure correct post height
    this.content.style.height = (this.container.offsetHeight - this.scrollbarSize) + 'px';

	this.containerRect = this.container.getBoundingClientRect();
	this.contentRect = this.content.getBoundingClientRect();
	this.childRect = this.getChildRect();
}

AltScroll.prototype.scroll = function(e)
{
	if (this.container.id === 'page-container' || 
		this.container.id === 'work' || 
		this.container.id === 'blog')
	{
	    clearTimeout(this.scrollTimeout);
	    this.scrollTimeout = setTimeout(function() {
	    	var nearest = this.calcNearestChild();

	        this.container.removeEventListener('scroll', this.scrollEvent);
	        this.scrollEvent = null;

	        switch (this.container.id)
	        {
	        	case 'page-container':
	        		pageHelper.currentPage = nearest + 1;
	        		this.snapTo(nearest);
	        		break;
	        	case 'work':
	        		pageHelper.currentPost[2] = nearest + 1;
	        		break;
	        	case 'blog':
	        		pageHelper.currentPost[3] = nearest + 1;
	        		break;
	        }

	        pageHelper.setHash();
	    }.bind(this), 500);
	}
}

/**
 * Helper objects.
 */
var mobileHelper = {

	isMobile: false,
	isTablet: false,
	isDesktop: false,

	init: function()
	{
		window.addEventListener('resize', mobileHelper.setDevice);
		mobileHelper.setDevice();
	},

	setDevice: function()
	{
		if (window.innerWidth < 1279 && window.innerWidth > 767)
		{
			mobileHelper.isMobile = false;
			mobileHelper.isTablet = true;
			mobileHelper.isDesktop = false;
		}
		else if (window.innerWidth < 767)
		{
			mobileHelper.isMobile = true;
			mobileHelper.isTablet = false;
			mobileHelper.isDesktop = false;
		}
		else
		{
			mobileHelper.isMobile = false;
			mobileHelper.isTablet = false;
			mobileHelper.isDesktop = true;
		}
	}
}

var backgroundHelper = {

	colorPallete: [
		['#175ba2', '#4146a7', '#0a91e7', '#a0cbfe'],
		['#155998', '#3c4aa1', '#0c92e0', '#9cccfa'],
		['#13568f', '#374e9b', '#0e94d8', '#98cdf5'],
		['#115485', '#315195', '#1195d1', '#94cdf1'],
		['#0f517b', '#2c558f', '#1397ca', '#90ceec'],
		['#0d4f72', '#275989', '#1598c3', '#8dcfe8'],
		['#0a4c68', '#225d82', '#1799bb', '#89d0e4'],
		['#084a5e', '#1d617c', '#199bb4', '#85d1df'],
		['#064754', '#176476', '#1c9cad', '#81d1db'],
		['#04454b', '#126870', '#1e9ea5', '#7dd2d6'],
		['#024241', '#0d6c6a', '#209f9e', '#79d3d2'],
		['#044541', '#147068', '#2aa199', '#83d5cb'],
		['#064840', '#1a7466', '#34a493', '#8cd6c3'],
		['#084a40', '#217965', '#3fa68e', '#96d8bc'],
		['#0a4d40', '#287d63', '#49a988', '#9fd9b4'],
		['#0d5040', '#2f8161', '#53ab83', '#a9dbad'],
		['#0f533f', '#35855f', '#5dad7e', '#b2dca6'],
		['#11563f', '#3c895d', '#67b078', '#bcde9e'],
		['#13583f', '#438e5c', '#72b273', '#c5df97'],
		['#155b3e', '#49925a', '#7cb56d', '#cfe18f'],
		['#175e3e', '#509658', '#86b768', '#d8e288'],
		['#265939', '#619253', '#91b565', '#dce084'],
		['#355435', '#718f4e', '#9cb363', '#e0dd80'],
		['#444e30', '#828b4a', '#a6b160', '#e4db7d'],
		['#53492c', '#928745', '#b1af5e', '#e8d879'],
		['#634427', '#a38440', '#bcae5b', '#ecd675'],
		['#723f22', '#b3803b', '#c7ac58', '#efd471'],
		['#813a1e', '#c47c36', '#d2aa56', '#f3d16d'],
		['#903419', '#d47832', '#dca853', '#f7cf6a'],
		['#9f2f15', '#e5752d', '#e7a651', '#fbcc66'],
		['#ae2a10', '#f57128', '#f2a44e', '#ffca62'],
		['#b52b1a', '#ef692d', '#f29d4f', '#ffcc66'],
		['#bb2c23', '#e96031', '#f2964f', '#fecd6a'],
		['#c22e2d', '#e35836', '#f28f50', '#fecf6f'],
		['#c82f36', '#dd503a', '#f28850', '#fed173'],
		['#cf3040', '#d8483f', '#f28151', '#fed377'],
		['#d5314a', '#d23f44', '#f17951', '#fdd47b'],
		['#dc3253', '#cc3748', '#f17252', '#fdd67f'],
		['#e2345d', '#c62f4d', '#f16b52', '#fdd884'],
		['#e93566', '#c02651', '#f16453', '#fcd988'],
		['#ef3670', '#ba1e56', '#f15d53', '#fcdb8c']
	],

	layers: null,

	previousIndex: 0,

	renderWidth: 0,
	renderHeight: 0,

	background: null,
	backgroundOverlay: null,
	gaussianBackground: null,

	resizeTimeout: null,

	init: function()
	{
		backgroundHelper.setParameters();

		backgroundHelper.background = document.getElementById('background');
		backgroundHelper.backgroundOverlay = document.getElementById('background-overlay');

		backgroundHelper.gaussianBackground = new GaussianBackground(backgroundHelper.background, backgroundHelper.layers, { 
			renderWidth: backgroundHelper.renderWidth,
			renderHeight: backgroundHelper.renderHeight,
			blurRadius: 4,
			fpsCap: 15,
			blurMethod: 'stackboxblur'
		});

		// Disable scroll paralax/color change on mobile for inproved performance
		if (!mobileHelper.isMobile)
		{
			document.getElementById('page-container').addEventListener('scroll', function(e) {
				window.requestAnimationFrame(function() {
					var pagePos = -(e.target.scrollLeft) / e.target.offsetWidth;
					var paralaxPos = pagePos * 10;
					var paralaxPercent = ((paralaxPos / 40) * 50).toFixed(2);
					var colorIndex = Math.round(-paralaxPos);

					backgroundHelper.setParalax(paralaxPercent);
					backgroundHelper.setColor(colorIndex);
				});
			});
		}

		window.addEventListener('resize', backgroundHelper.updateBackground);
	},

	setParameters: function()
	{
		var aspectRatio = window.innerWidth / window.innerHeight;
		var randomIndex = Math.floor(Math.random() * 5) * 10;

		if (aspectRatio > 1)
		{
			if (!mobileHelper.isMobile)
			{
				backgroundHelper.layers = [
					{ orbs: 4, radius: 8, maxVelocity: .15, color: backgroundHelper.colorPallete[backgroundHelper.previousIndex][0], columns: 4 },
					{ orbs: 6, radius: 6, maxVelocity: .15, color: backgroundHelper.colorPallete[backgroundHelper.previousIndex][1], rows: 2 },
					{ orbs: 10, radius: 3, maxVelocity: .15, color: backgroundHelper.colorPallete[backgroundHelper.previousIndex][2], columns: 2, rows: 2 },
					{ color: backgroundHelper.colorPallete[backgroundHelper.previousIndex][3] }
				];
			}
			else
			{
				backgroundHelper.layers = [
					{ orbs: 2, radius: 10, maxVelocity: .15, color: backgroundHelper.colorPallete[randomIndex][0], columns: 2 },
					{ orbs: 3, radius: 8, maxVelocity: .15, color: backgroundHelper.colorPallete[randomIndex][1], columns: 2 },
					{ orbs: 5, radius: 5, maxVelocity: .15, color: backgroundHelper.colorPallete[randomIndex][2] },
					{ color: backgroundHelper.colorPallete[randomIndex][3] }
				];
			}
		}
		else
		{
			if (!mobileHelper.isMobile)
			{
				backgroundHelper.layers = [
					{ orbs: 4, radius: 8, maxVelocity: .15, color: backgroundHelper.colorPallete[backgroundHelper.previousIndex][0], rows: 4 },
					{ orbs: 6, radius: 6, maxVelocity: .15, color: backgroundHelper.colorPallete[backgroundHelper.previousIndex][1], columns: 2 },
					{ orbs: 10, radius: 3, maxVelocity: .15, color: backgroundHelper.colorPallete[backgroundHelper.previousIndex][2], columns: 2, rows: 2 },
					{ color: backgroundHelper.colorPallete[backgroundHelper.previousIndex][3] }
				];
			}
			else
			{
				backgroundHelper.layers = [
					{ orbs: 2, radius: 10, maxVelocity: .15, color: backgroundHelper.colorPallete[randomIndex][0], rows: 2 },
					{ orbs: 3, radius: 8, maxVelocity: .15, color: backgroundHelper.colorPallete[randomIndex][1], rows: 2 },
					{ orbs: 5, radius: 5, maxVelocity: .15, color: backgroundHelper.colorPallete[randomIndex][2] },
					{ color: backgroundHelper.colorPallete[randomIndex][3] }
				];
			}
		}

		backgroundHelper.renderWidth = aspectRatio > 1 ? 30 : 15;
		backgroundHelper.renderHeight = aspectRatio > 1 ? 15 : 30;
	},

	setParalax: function(pos)
	{
		backgroundHelper.backgroundOverlay.style.transform = 'translate(' + pos + '%)';
	},

	setColor: function(colorIndex)
	{
		if (colorIndex !== backgroundHelper.previousIndex)
		{
			backgroundHelper.gaussianBackground.changeLayerColors(backgroundHelper.colorPallete[colorIndex]);
			backgroundHelper.previousIndex = colorIndex;
		}
	},

	updateBackground: function()
	{
		clearTimeout(backgroundHelper.resizeTimeout);
		backgroundHelper.resizeTimeout = setTimeout(function() {
			backgroundHelper.setParameters();
			backgroundHelper.gaussianBackground.updateLayers(backgroundHelper.layers);
			backgroundHelper.gaussianBackground.updateOptions({ renderWidth: backgroundHelper.renderWidth, renderHeight: backgroundHelper.renderHeight });
		}, 500);
	}
};

var pageHelper = {

	currentPage: 1,
	currentPost: [1,1,1,1,1],

	pageScroll: null,
	pages: [],

	pageScrollTimeout: null,
	postScrollTimeout: null,

	init: function()
	{
		pageHelper.pageScroll = new AltScroll(document.getElementById('page-container'), { momentumFalloff: .01 });
		pageHelper.pages[0] = new AltScroll(document.getElementById('home'));
		pageHelper.pages[1] = new AltScroll(document.getElementById('about'));
		pageHelper.pages[2] = new AltScroll(document.getElementById('work'));
		pageHelper.pages[3] = new AltScroll(document.getElementById('blog'));
		pageHelper.pages[4] = new AltScroll(document.getElementById('contact'));

		if (window.location.hash || mobileHelper.isMobile || mobileHelper.isTablet)
		{
			document.getElementById('overflow-container').className += ' stop-bounce load';
			pageHelper.gotoHash(window.location.hash, 0);
		}
		else
		{
			var stopBounce = function() {
				document.getElementById('overflow-container').className += ' stop-bounce';
				document.removeEventListener('touchstart', stopBounce);
				document.removeEventListener('mousedown', stopBounce);
			};

			document.addEventListener('touchstart', stopBounce);
			document.addEventListener('mousedown', stopBounce);
		}
	},

	gotoHash: function(hash, speed)
	{
		var urlData = hash.split('/');
		var page, post;

		if (urlData.shift() === '#!')
		{
			for (var i = 0, len = urlData.length; i < len; i++)
			{
				if (urlData[i] === 'page')
				{
					if (parseInt(urlData[i + 1]))
					{
						page = parseInt(urlData[i + 1]);
					}
				}

				if (urlData[i] === 'post')
				{
					if (parseInt(urlData[i + 1]))
					{
						post = parseInt(urlData[i + 1]);
					}
				}
			}
		}

		pageHelper.gotoPage(page, post, speed);
	},

	gotoPage: function(page, post, speed)
	{
		page = page ? page : pageHelper.currentPage;
		post = post ? post : pageHelper.currentPost[page - 1];

		pageHelper.pageScroll.snapTo(page - 1, speed);
		pageHelper.pages[page - 1].snapTo(post - 1, speed);

		pageHelper.currentPage = page;
		pageHelper.currentPost[page - 1] = post;
	},

	gotoNextPost: function(speed)
	{
		var nearestChild = pageHelper.pages[pageHelper.currentPage - 1].calcNearestChild();
		pageHelper.gotoPage(pageHelper.currentPage, nearestChild + 2, speed);
	},

	gotoPrevPost: function(speed)
	{
		var nearestChild = pageHelper.pages[pageHelper.currentPage - 1].calcNearestChild();
		pageHelper.gotoPage(pageHelper.currentPage, nearestChild, speed);
	},

	setHash: function(hash)
	{
		window.location.hash = '!/page/' + pageHelper.currentPage;

		switch(parseInt(pageHelper.currentPage))
		{
			case 3:
			case 4:
				window.location.hash += '/post/' + pageHelper.currentPost[pageHelper.currentPage - 1];
				break;
		}
	}
};

var menuHelper = {

	menu: null,

	init: function()
	{
		menuHelper.menu = document.getElementById('menu');
		menuHelper.bindEvents();
	},

	bindEvents: function()
	{
		document.getElementById('show-menu').addEventListener('click', function() {
			menuHelper.menu.className = menuHelper.menu.className !== 'active' ? 'active' : 'inactive';
		});

		document.addEventListener('click', function(e) {
			if (menuHelper.menu.className === 'active')
			{
				var target = e.target;
				var menuButton = document.getElementById('show-menu');

				if (target.id !== 'show-menu' && target.id !== 'menu' && !menuHelper.childOf('show-menu', target) && !menuHelper.childOf('menu', target))
					menuButton.dispatchEvent(new Event('click'));
			}
		});
	},

	childOf: function(id, element)
	{
		if (!element.parentElement)
			return false;
		if (element.parentElement.id !== id)
			return menuHelper.childOf(id, element.parentElement);
		return element.parentElement;
	}
}

/**
 * Site init.
 */
document.addEventListener("DOMContentLoaded", function(event) {
	mobileHelper.init();
	menuHelper.init();
	pageHelper.init();
	backgroundHelper.init();
});