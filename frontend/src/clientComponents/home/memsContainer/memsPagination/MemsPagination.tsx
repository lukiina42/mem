import React, {Dispatch, SetStateAction} from 'react'
import LoadingSpinner from "@/utilComponents/Loading";
import {Mem} from "@/types/mem";
import {InView} from "react-intersection-observer";
import {FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult} from "@tanstack/query-core";

interface Props {
    ssrMemsLength: number;
    hasNextPage: boolean;
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<InfiniteData<Mem[], unknown>, Error>>
    isFetchingNextPage: boolean;
    setLoadedMoreMems: Dispatch<SetStateAction<boolean>>
    loadedMoreMems: boolean;
}

export default function MemsPagination({
    ssrMemsLength,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    setLoadedMoreMems,
    loadedMoreMems
}: Props) {
    const handleLoadMoreMems = () => {
        setLoadedMoreMems(true)
        if (hasNextPage) fetchNextPage();
    };

    return (
        <InView as="div" onChange={handleLoadMoreMems}>
            <div className="w-full text-lg font-bold h-24 flex items-center justify-center p-2">
                {ssrMemsLength < 9 ? (
                    'No more mems here!'
                ) : hasNextPage || !loadedMoreMems ? (
                        <button
                            className="basic-button w-32 h-10 flex justify-center items-center"
                            onClick={handleLoadMoreMems}
                        >
                            {isFetchingNextPage ? <LoadingSpinner /> : 'Load more'}
                        </button>
                    ) : (
                        'No more mems here!'
                    )
                }
            </div>
        </InView>
    )
}
