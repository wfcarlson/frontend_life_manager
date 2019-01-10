let backendHost;
let api_key;

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost"){
	backendHost = "https://test.api.waltercarlson.com";
	api_key = "v1yQKbdYIw3uV5zMPwUWF54iz1bCsFyd3P8yJl96";
}
else {
	backendHost = "https://api.waltercarlson.com";
	api_key = "";
}

export const API_ROOT = backendHost;
export const API_KEY = api_key;