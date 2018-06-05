'use strict'

function get(address, obj) {
	const adr = address.split('.')
	let o = obj
	for (let i = 0; i < adr.length; i++) {
		if (typeof o[adr[i]] === 'undefined') {
			return false
		} else {
			o = o[adr[i]]
		}
	}
	return o
}

module.exports = {
  seo: function (arr, cfg) {
  	const tags = [
  		// General
  		[ 'description', 'description', 'name' ],
  		[ 'author', 'author.name', 'name' ],
			// OpenGraph
			[ 'og:title', 'title', 'property' ],
			[ 'og:locale', 'lang', 'property' ],
			[ 'og:description', 'description', 'property' ],
			[ 'og:url', 'url', 'property' ],
			[ 'og:site_name', 'title', 'property' ],
			// Twitter
			[ 'twitter:site', 'author.twitter', 'name' ],
			[ 'twitter:creator', 'author.twitter', 'name' ],
			// Verification
			[ 'google-site-verification', 'verification.google', 'name' ],
			[ 'yandex-verification', 'verification.yandex', 'name' ],
			[ 'msvalidate.01', 'verification.bing', 'name' ],
			[ 'alexaVerifyID', 'verification.alexa', 'name' ],
			[ 'p:domain_verify', 'verification.pinterest', 'name' ],
			[ 'norton-safeweb-site-verification', 'verification.norton', 'name' ]
		]
		tags.forEach(tag => {
			const [attr, key, name] = tag
			const value = get(key, cfg)
			if (value) {
				arr.push( { hid: attr, [name]: attr, content: value })
			}
		})
  	return arr
  }
}
