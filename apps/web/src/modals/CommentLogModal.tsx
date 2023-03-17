import { Component } from 'solid-js'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { toast } from '~/components/Toast'
import BaseModal from './BaseModal'

interface Props {
  comment: () => string
  setComment: (comment: string) => void
}

export const [commentLogModalOpen, setCommentLogModalOpen] =
  createSignal<boolean>(false)

export const CommentLogModal: Component<Props> = (props) => {
  let inputElement!: HTMLInputElement

  const formSchema = z.object({
    comment: z.string(),
  })
  type formSchemaType = z.infer<typeof formSchema>

  const getDefaultData: () => formSchemaType = () => ({
    comment: props.comment(),
  })
  const [formData, setFormData] = createStore<formSchemaType>(getDefaultData())

  createEffect(() => {
    if (commentLogModalOpen()) {
      inputElement.focus()

      // select all
      inputElement.selectionStart = 0
      inputElement.selectionEnd = inputElement.value.length
    }
  })

  function onSubmit() {
    try {
      formSchema.parse(formData)
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err)

        let message = validationError.message
        message = message.slice(message.indexOf(':') + 1)
        message = message.replaceAll(';', '\n').trim()

        toast('Invalid Input', message, {
          type: 'error',
        })
      }
      return
    }

    props.setComment(formData.comment)

    toast('Comment added successfully', ``, {
      type: 'success',
    })
    setFormData(getDefaultData())
    setCommentLogModalOpen(false)
  }

  return (
    <BaseModal
      open={commentLogModalOpen()}
      onOpen={() => setCommentLogModalOpen(true)}
      onClose={() => setCommentLogModalOpen(false)}
    >
      <h3 class="font-bold text-lg">Comment Log</h3>
      <form
        class="py-5 flex flex-col gap-3"
        method="dialog"
        onSubmit={onSubmit}
      >
        <input
          ref={inputElement}
          type="text"
          placeholder="Write your comment here"
          class="input input-bordered w-full"
          value={formData.comment}
          onInput={(e) => setFormData('comment', e.currentTarget.value)}
        />
        <div class="modal-action">
          <button class="btn uppercase flex gap-2 items-center btn-success">
            <div class="text-lg i-carbon-edit"></div> Comment
          </button>
        </div>
      </form>
    </BaseModal>
  )
}

export default CommentLogModal
