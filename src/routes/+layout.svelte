<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import { DatabaseManager, p } from 'pocketto';

	let { children } = $props();

	p.setEnvironment('browser');
	p.setIdMethod('timestamp');
	DatabaseManager.connect('default', {
		dbName: 'default',
		adapter: 'idb'
	}).then(async (localDb) => {
		try {
			const remoteDb = await DatabaseManager.connect('http://localhost:5984/test', {
				dbName: 'test',
				adapter: 'http',
				auth: {
					username: 'admin',
					password: 'qwer1234'
				}
			});
			localDb?.sync(remoteDb, {
				live: true,
				retry: true
			});
			p.setRealtime(true);
		} catch (error) {}
	});
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<footer>
		<p>
			visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to learn about SvelteKit
		</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
