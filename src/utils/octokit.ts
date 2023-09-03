import { Octokit } from "octokit";

const octokitInstance = new Octokit({
    auth: import.meta.env.REACT_APP_GH_TOKEN
});

export default octokitInstance