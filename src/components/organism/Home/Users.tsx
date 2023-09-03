import { useInfiniteQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getUsers } from '../../../services/users';
import { ResponseSearchUser } from '../../../types/user';
import User from './User';


export default function Users() {
    const { ref, inView } = useInView()
    const [searchUser, setSearchUser] = useState('')
    const [submit, setSubmit] = useState(false)
    const {
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        ...result
    } = useInfiniteQuery({
        enabled: submit,
        queryKey: ['search-user', searchUser],
        queryFn: async ({ pageParam = 1 }) => getUsers({ page: pageParam, query: searchUser }),
        getNextPageParam: (lastPage, allPages) => {
            let pageActive = allPages.length
            const totalpage = Math.round(lastPage.total_count / 20)
            if (pageActive < totalpage) {
                return pageActive += 1
            }
            return undefined
        },
    })
    useEffect(() => {
        if (inView && submit === true) {
            fetchNextPage()
        }
    }, [inView])

    const handleChange = debounce((e: string) => {
        setSearchUser(e)
        setSubmit(false)
    }, 0)

    const listUser = result.data?.pages.map((page: ResponseSearchUser) => page.items).flat(1) ?? []

    return (
        <div className=' px-5 md:px-10 min-h-screen'>
            <div className=' fixed top-0 left-0 right-0 bg-white shadow-sm'>
                <form className=' flex flex-col p-5 md:p-10 gap-5 md:flex-row' onSubmit={(e) => {
                    e.preventDefault()
                    setSubmit(true)
                }}>
                    <input onChange={(e) => {
                        handleChange(e.target.value)
                    }} type="text" className=' p-3 outline-none border-2 border-gray-300 rounded-md grow' placeholder='Enter Username' />
                    <button className=' bg-sky-500 py-3 rounded-md text-white md:w-36'>Search</button>
                </form>
            </div>
            <div className=' h-[160px] md:h-[132px]'></div>
            <div className=' flex flex-col gap-3 '>
                {
                    result.status === "loading" && submit === true ?
                        <p>Loading...</p>
                        : result.status === "success" && listUser.length > 0 && submit ?
                            <>
                                <p>Showing users for "{searchUser}"</p>
                                {
                                    listUser.map((user) => {
                                        return <User user={user} key={user.login} />
                                    })
                                }
                            </>
                            : <p>No Found Data</p>
                }
            </div>
            {
                submit === true && <button
                    className=' '
                    ref={ref}
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                >
                    {isFetchingNextPage
                        ? 'Loading more...'
                        : hasNextPage
                            ? 'Load Newer'
                            : ''}
                </button>
            }

        </div>
    )
}
