import { createSignal, Component } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { toast } from '~/components/Toast'

interface Props {
  comment: () => string
  setComment: (comment: string) => void
}

export const CommentLogModal: Component<Props> = (props) => {
  const [open, setOpen] = createSignal<boolean>(false)

  const formSchema = z.object({
    comment: z.string(),
  })
  type formSchemaType = z.infer<typeof formSchema>

  const getDefaultData: () => formSchemaType = () => ({
    comment: props.comment(),
  })
  const [formData, setFormData] = createStore<formSchemaType>(getDefaultData())

  return (
    <>
      <input
        type="checkbox"
        id="comment-log-modal"
        class="modal-toggle"
        checked={open()}
        onChange={(e) => setOpen(e.currentTarget.checked)}
      />
      <label for="comment-log-modal" class="modal">
        <label class="modal-box">
          <h3 class="font-bold text-lg">Comment Log</h3>
          <form
            class="py-5 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault()
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
              setOpen(false)
            }}
          >
            <input
              type="text"
              placeholder="Write your comment here"
              class="input input-bordered w-full"
              value={formData.comment}
              onInput={(e) => setFormData('comment', e.currentTarget.value)}
            />
            <div class="modal-action">
              <button class="btn uppercase flex gap-2 items-center">
                <div class="text-lg i-carbon-edit"></div> Comment
              </button>
            </div>
          </form>
        </label>
      </label>
    </>
  )
}

export default CommentLogModal
