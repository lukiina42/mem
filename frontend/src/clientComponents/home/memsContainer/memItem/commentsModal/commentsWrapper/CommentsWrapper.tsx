import React, {useState} from 'react'
import LoadingSpinner from "@/utilComponents/Loading";
import NewCommentForm from "@/clientComponents/home/memsContainer/memItem/commentsModal/newCommentForm/NewCommentForm";
import RecursiveComment
    from "@/clientComponents/home/memsContainer/memItem/commentsModal/recursiveComment/RecursiveComment";
import {Mem} from "@/types/mem";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getComments} from "@/clientApiCalls/commentApi";
import {Comment} from "@/types/comment";

interface Props {
    mem: Mem;
    token: string;
}


export default function CommentsWrapper({mem, token}: Props) {
    const memDetailQueryKey = [`memComment`, mem.id];

    const { data, isLoading } = useQuery({
        queryKey: memDetailQueryKey,
        queryFn: () => getComments({ memId: mem.id }),
    });

    const queryClient = useQueryClient();

    const refetch = () => {
        queryClient.invalidateQueries({ queryKey: memDetailQueryKey });
    };

    const [replyComment, setReplyComment] = useState<null | Comment>(null);

    if (isLoading) {
        return (
            <div className="h-full w-full flex justify justify-center items-center">
                <LoadingSpinner/>
            </div>
        )
    }

    return <div className="flex w-full min-h-[10rem]">
        <div className="md:w-16 w-4"></div>
        <div className="grow">
            {token && (
                <NewCommentForm
                    replyComment={replyComment}
                    memId={mem.id}
                    refetch={refetch}
                    token={token}
                    setReplyComment={setReplyComment}
                />
            )}

            <div className={`flex flex-col mt-4`}>
                {data?.length == 0 ? (
                    <div>No comments yet!</div>
                ) : (
                    data?.map((comment, i) => {
                        return (
                            <RecursiveComment
                                key={comment.id}
                                isRoot={true}
                                comment={comment}
                                marginLeft={0}
                                isFirst={i == 0}
                                setReplyComment={setReplyComment}
                                replyComment={replyComment}
                            />
                        );
                    })
                )}
            </div>
        </div>
    </div>
}
