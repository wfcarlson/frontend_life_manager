let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost"){
	backendHost = "http://localhost:8080";
}
else {
	backendHost = "http://35.231.134.203";
}

export const API_ROOT = backendHost;