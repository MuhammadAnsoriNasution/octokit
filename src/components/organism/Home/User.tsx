/* eslint-disable react-refresh/only-export-components */
import { useQuery } from "@tanstack/react-query"
import { memo, useState } from "react"
import { chevronDown } from "../../../assets"
import { getRepoByUser } from "../../../services/users"
import { UserTypes } from "../../../types/user"
import Repository from "./Repository"

interface Props {
    user: UserTypes
}
export default memo(function User({ user }: Props) {
    const [showRepo, setShowRepo] = useState(false)

    const repositoryQuery = useQuery({
        queryFn: () => getRepoByUser({ username: user.login }),
        queryKey: ['repository', user.login],
        enabled: showRepo,
    })
    const repositoryData = repositoryQuery?.data ?? []

    return (
        <div className=' '>
            <button className=' bg-neutral-200 p-2 rounded-md text-left w-full flex gap-2  items-center' onClick={() => setShowRepo(!showRepo)}>
                <span className=" line-clamp-1 grow">{user.login}</span>
                <img src={chevronDown} className={` transition duration-1000 ${showRepo ? ' rotate-180' : ''}`} width={16} alt="" />
            </button>

            <div className={`flex flex-col gap-2 mt-2 ml-5 duration-1000 transition-all max-h-0 overflow-scroll ${showRepo === true ? ' max-h-screen' : ''}`}>
                {
                    repositoryQuery.status === "loading" ?
                        <p>Loading...</p>
                        : repositoryQuery.status === "success" && repositoryData.length > 0 ?
                            repositoryData.map((repository) => {
                                return <Repository description={repository.description} name={repository.name} stargazers_count={repository.stargazers_count} key={repository.id} />
                            })
                            : <p>No Found repository</p>
                }

            </div>
        </div>
    )
})