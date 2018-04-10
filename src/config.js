let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost"){
	backendHost = "http://localhost:8000";
}
else {
	backendHost = "";
}

export const API_ROOT = backendHost;