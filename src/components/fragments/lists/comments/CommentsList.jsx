import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AuthService from '../../../../api/service/AuthService'
import UserService from '../../../../api/service/UserService'
import commentsStyle from './comment.module.css'

import useInput from '../../../hooks/useInput'
import CommentService from '../../../../api/service/CommentService'
import AuthUser from '../../../context/AuthUser'
import { createErrorToast, createSuccessToast } from '../../../util/toast'

// import TextArea from '../../../fragments/text/TextArea'

import { format, parseISO } from 'date-fns'

// /**
//  *
//  * @param {Array<{id, text, ownerId, commentId}>} comments
//  * @returns
//  */
// export default function CommentsList({ comments, createComment }) {
//   const commentText = useInput('')
//   const authService = new AuthService()
//   const userService = new UserService(authService.getToken())

//   const commentService = new CommentService(authService.getToken())

//   function CommentLine({ comment }) {
//     console.log(comment)
//     const [user, setUser] = useState(null)

//     async function deleteComment(commentId) {
//       if (commentId) {
//         const response = await commentService.deleteUserComment(
//           AuthUser.getUser().id,
//           commentId
//         )

//         if (response.status == 200) {
//           createSuccessToast('Коментарій був видалений')
//         } else {
//           createErrorToast('Сталася помилка при видаленні коментаря')
//         }
//       }
//     }

//     useEffect(() => {
//       async function fetchUser() {
//         if (comment?.ownerId) {
//           try {
//             const response = await userService.getUser(comment.ownerId)
//             console.log(response.data)
//             setUser(response.data)
//           } catch (error) {
//             console.error('Error fetching user:', error)
//           }
//         }
//       }

//       fetchUser()
//     }, [comment.ownerId])

//     const formattedDate = format(
//       parseISO(comment.createdAt),
//       'dd.MM.yyyy, HH:mm'
//     )

//     return (
//       <div className="mt-3 pt-4">
//         <div key={comment.id} className={`tab my-2 ${commentsStyle.tab}`}>
//           <div className={`tab-inner ${commentsStyle.tabInner}`}>
//             <div className="d-flex justify-between">
//               <div className="d-flex flex-column">
//                 <div className="d-flex">
//                   {user?.userImageUrl && (
//                     <img
//                       src={user?.userImageUrl}
//                       alt="Фотографія"
//                       style={{ maxWidth: '50px' }}
//                     />
//                   )}
//                   <div className="d-flex flex-column p-2">
//                     <a href={`/user/${comment.ownerId}`}>{user?.username}</a>
//                     <span>додано було {formattedDate}</span>
//                   </div>
//                 </div>
//                 {/* <!--                    chapter link --> */}
//                 <div style={{ wordBreak: 'normal' }}>{comment.text}</div>
//               </div>
//             </div>

//             <div className="group-buttons">
//               <button
//                 className="btn btn-danger mx-1"
//                 onClick={() => deleteComment(comment.id)}
//               >
//                 <i className="bi bi-trash"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//         {/* <button className="btn btn-primary">Відповісти</button> */}
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="my-5 pt-5">
//         <div className="h2">Коментарі</div>

//         <div className="pt-3">
//           <textarea
//             style={{ width: '100%', backgroundColor: 'transparent' }}
//             className="my-2 form-control color-text"
//             name="new-comment"
//             id="new-password"
//             placeholder="Написати новий коментар..."
//             value={commentText.value}
//             onChange={commentText.onChange}
//             onInput={(event) => {
//               event.target.style.height = 'auto'
//               event.target.style.height = event.target.scrollHeight + 'px'
//             }}
//           ></textarea>
//           <button
//             className="btn btn-primary"
//             onClick={() => createComment(commentText.value)}
//           >
//             Відправити
//           </button>
//         </div>

//         <div
//           className="border-bottom border-3 py-3"
//           style={{ color: 'var(--color-text)' }}
//         ></div>

//         {comments.length > 0 ? (
//           comments.map((c, i) => <CommentLine comment={c} />)
//         ) : (
//           <div className={`tab border-radius mb-2 ${commentsStyle.tab}`}>
//             Поки тут немає ні одного коментарія. Будьте тим хто буде першим
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

const CommentLine = React.memo(({ comment, deleteComment, authUser }) => {
  const [user, setUser] = useState(null)
  const authService = new AuthService()
  const userService = new UserService(authService.getToken())

  useEffect(() => {
    async function fetchUser() {
      if (comment?.ownerId) {
        try {
          const response = await userService.getUser(comment.ownerId)
          setUser(response.data)
        } catch (error) {
          console.error('Error fetching user:', error)
        }
      }
    }
    fetchUser()
  }, [comment.ownerId])

  const formattedDate = format(parseISO(comment.createdAt), 'dd.MM.yyyy, HH:mm')

  return (
    <div className="mt-3 pt-4">
      <div key={comment.id} className={`tab my-2 ${commentsStyle.tab}`}>
        <div className={`tab-inner ${commentsStyle.tabInner}`}>
          <div className="d-flex justify-between">
            <div className="d-flex flex-column">
              <div className="d-flex">
                {user?.userImageUrl && (
                  <img
                    src={user?.userImageUrl}
                    alt="Фотографія"
                    style={{ maxWidth: '50px' }}
                  />
                )}
                <div className="d-flex flex-column p-2">
                  <a
                    className="fw-bold elem-link"
                    href={`/user/${comment.ownerId}`}
                  >
                    {user?.username}
                  </a>
                  <span>додано було {formattedDate}</span>
                </div>
              </div>
              <div style={{ wordBreak: 'normal' }}>{comment.text}</div>
            </div>
          </div>
          {authUser.getUser()?.id == comment.ownerId && (
            <div className="group-buttons">
              <button
                className="btn btn-danger mx-1"
                onClick={() => deleteComment(comment.id)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default function CommentsList({ comments, createComment }) {
  const commentText = useInput('')
  const authService = new AuthService()
  const commentService = new CommentService(authService.getToken())

  const [authUser, setAuthUser] = useState(new AuthUser())

  const [isCommentTextEmpty, setIsCommentTextEmpty] = useState(false)

  const handleCommentChange = useCallback(
    (e) => {
      commentText.onChange(e)
    },
    [commentText]
  )
  useEffect(() => {
    async function fetchAuthUser() {
      const user = await authService.getAuthUser()

      console.log('fetch authuser')

      setAuthUser(user)
    }

    fetchAuthUser()
  }, [])

  const handleAddComment = useCallback(() => {
    if (!commentText.value.trim().length) {
      setIsCommentTextEmpty(true)
    } else {
      setIsCommentTextEmpty(false)

      createComment(commentText.value)
    }
  }, [commentText.value, createComment])

  const handleDeleteComment = useCallback(
    async (commentId) => {
      if (commentId) {
        const response = await commentService.deleteUserComment(
          authUser.getUser().id,
          commentId
        )

        if (response.status === 200) {
          createSuccessToast('Коментарій був видалений')
        } else {
          createErrorToast('Сталася помилка при видаленні коментаря')
        }
      }
    },
    [commentService]
  )

  return (
    <>
      <div className="my-5 pt-5">
        <div className="p-2">
          <div className="h2">Коментарі</div>
          <div className="my-3">
            <textarea
              style={{
                width: '100%',
                backgroundColor: 'transparent',
              }}
              className={`my-2 form-control color-text ${
                !isCommentTextEmpty ? '' : 'formlementIsEmpty'
              }`}
              name="new-comment"
              placeholder="Написати новий коментар..."
              value={commentText.value}
              onChange={handleCommentChange}
              onInput={(event) => {
                event.target.style.height = 'auto'
                event.target.style.height = event.target.scrollHeight + 'px'
              }}
            ></textarea>

            {/* <div className="my-3"> */}
            {/* <TextArea
              placeholder="Написати новий коментарій..."
              onChange={handleCommentChange}
              value={commentText.value}
              className={`my-2 form-control color-text ${
                !isCommentTextEmpty ? '' : 'formlementIsEmpty'
              }`}
            /> */}
            {/* </div> */}

            {isCommentTextEmpty && (
              <div className="my-2" style={{ color: 'red' }}>
                Коментарій не може бути пустим
              </div>
            )}

            <button className="btn btn-primary" onClick={handleAddComment}>
              Відправити
            </button>
          </div>
          <div
            className="border-bottom border-3 py-3"
            style={{ color: 'var(--color-text)' }}
          ></div>
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <CommentLine
                key={c.id}
                comment={c}
                authUser={authUser}
                deleteComment={handleDeleteComment}
              />
            ))
          ) : (
            <div className={`text-center border-radius py-3 my-2`}>
              Поки тут немає ні одного коментарія. Будьте тим хто буде першим
            </div>
          )}
        </div>
      </div>
    </>
  )
}
