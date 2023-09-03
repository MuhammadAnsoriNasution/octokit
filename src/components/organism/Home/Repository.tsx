import { star } from "../../../assets"

interface Props {
    name: string,
    stargazers_count?: number,
    description: string | null
}
export default function Repository(repository: Props) {
    return (
        <div className=" bg-neutral-300 p-1 rounded-md flex flex-col gap-2" >
            <div className=" flex">
                <div className=" grow">
                    <p>{repository.name}</p>
                </div>
                <div className=" flex gap-1">
                    <p>{repository.stargazers_count}</p>
                    <img src={star} alt="" width={16} />
                </div>

            </div>
            <p>{repository.description ?? 'Description'}</p>
        </div>
    )
}
