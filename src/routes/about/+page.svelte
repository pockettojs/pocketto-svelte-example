<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>About this app</h1>

	<p>
		This is a <a href="https://svelte.dev/docs/kit">SvelteKit</a> app. You can make your own by typing
		the following into your command line and following the prompts:
	</p>

	<pre>npx sv create</pre>

	<p>
		The page you're looking at is purely static HTML, with no client-side interactivity needed.
		Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
		the devtools network panel and reloading.
	</p>

	<p>
		The <a href="/sverdle">Sverdle</a> page illustrates SvelteKit's data loading and form handling. Try
		using it with JavaScript disabled!
	</p>

	<div class="h-8"></div>

	<h1>Pocketto integration</h1>

	<p>
		<a href="https://pocketto.dev">Pocketto</a> is a framework for SvelteKit that allows you to create
		real time data binding with your SvelteKit app.
	</p>

	<p>You can install it by running:</p>

	<pre>npm install pocketto pocketto-svelte</pre>

	<p>
		And refer to the <a href="https://pocketto.dev/docs/frontend-api/pocketto-svelte"
			>documentation</a
		> to learn more!
	</p>
</div>
