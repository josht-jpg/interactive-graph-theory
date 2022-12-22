<script lang="ts">
	// import type { CredentialResponse, GsiButtonConfiguration } from 'google-one-tap';

	import { browser } from '$app/env';

	const clientId = '240897179968-nka9k0uvrfrfcartdh6r7cuse4jns4om.apps.googleusercontent.com';
	const buttonId = 'google-sign-in-button';
	let gisLoaded = false;

	const googleAuthScript = 'https://accounts.google.com/gsi/client';

	const renderButton = (options: GsiButtonConfiguration) => {
		if (window.google) {
			const button = document.getElementById(buttonId);
			console.log(button, 'button');
			if (button) {
				window.google.accounts.id.renderButton(button, options);
			}
		}
	};

	const handleResponse = (credentialResponse: CredentialResponse) => {
		// onClick?.();
		console.log(credentialResponse, 'credentialResponse');

		if (!credentialResponse.credential) {
			// onError?.('auth failure, clientId or credential missing');
			return;
		} else {
			//   onSuccess?.(credentialResponse.credential);
		}
	};

	const handleInitializationError = (error: string) => {
		// onError?.(error);
	};

	const initializeClient = () => {
		console.log(window.google, 'google');

		if (!window.google) {
			return;
		}

		gisLoaded = true;

		try {
			// https://developers.google.com/identity/gsi/web/reference/js-reference
			window.google.accounts.id.initialize({
				client_id: clientId,
				auto_select: true,
				callback: handleResponse
			});
		} catch (error) {
			console.log('error');
			handleInitializationError(String(error));
		}
	};

	$: if (gisLoaded) {
		console.log('gisLoaded', gisLoaded);

		renderButton({
			type: 'standard',
			theme: 'filled_blue',
			text: 'continue_with',
			shape: 'pill'
		});
	}
</script>

<!-- <a
	href="http://127.0.0.1:5173/auth/google"
	class="rounded-full shadow-blue-200 shadow-lg absolute top-2 cursor-pointer z-[300] right-2 text-sm p-2"
>
	<img
		class="inline w-6 h-6"
		alt="Google Logo"
		src="https://developers.google.com/identity/images/g-logo.png"
	/>
	<span>Sign in with Google</span>
</a> -->

<svelte:head>
	{#if browser}
		<script src={googleAuthScript} on:load={initializeClient}></script>
	{/if}
</svelte:head>

<div class="w-[200px] h-10 absolute right-3 top-3 z-10">
	<!-- {#if gisLoaded} -->
	<button id={buttonId} />
	<!-- {/if} -->
</div>
