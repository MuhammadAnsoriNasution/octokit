/* eslint-disable no-useless-catch */
import octokitInstance from "../utils/octokit";

export async function getUsers({ query, page }: { query: string, page: number }) {
    try {
        return octokitInstance.request("GET /search/users", {
            q: query,
            page: page,
            per_page: 20,
        }).then((ress) => ress.data)
    } catch (error) {
        throw error
    }

}

export async function getRepoByUser({ username }: { username: string }) {
    try {
        return await octokitInstance.paginate("GET /users/{username}/repos", {
            username: username,
        })
    } catch (error) {
        throw error
    }

}