import { signOut } from "next-auth/react"
import { revalidatePath } from "next/cache";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react"

interface Delete {
  handleDelete: () => Promise<void> | ((arg: string) => Promise<void>) | void
  deleteUser: () => Promise<void>;
  deleteMessage: string
  confirmDeleteUser: boolean
  setShowDeleteConfirmation: Dispatch<SetStateAction<boolean>>
  setConfirmDeleteUser: Dispatch<SetStateAction<boolean>>
  setVerificationPassword: Dispatch<SetStateAction<string>>
  setError: Dispatch<SetStateAction<string>>
  error: string
  googleUser: boolean
  showDeleteConfirmation: boolean
}

const DeleteModal = ({
  handleDelete,
  deleteUser,
  googleUser,
  deleteMessage,
  setShowDeleteConfirmation,
  confirmDeleteUser,
  setVerificationPassword,
  setConfirmDeleteUser,
  showDeleteConfirmation,
  setError,
  error }: Delete) => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white p-8 rounded shadow-lg animate-fade-in w-72 xs:w-auto">
        <p className="text-xl mb-4 text-center dark:text-gray-900">{deleteMessage}</p>
        <div className={`flex justify-center ${confirmDeleteUser && !googleUser ? 'flex-col' : 'flex-row'}`}>
          {confirmDeleteUser && !googleUser &&
            <form>
              <input
                type="password"
                className="w-full px-5 py-2 border-2"
                placeholder="Enter password"
                onChange={(e) => setVerificationPassword(e.target.value)}
              />
              {error && (
                <p className="text-red-500 text-xs mt-1">Incorrect password</p>
              )}
            </form>}
          <div className="flex justify-center">
            <button
              className="mt-3 mr-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
              onClick={() => {
                if (confirmDeleteUser && !googleUser) {
                  deleteUser();
                } else if (showDeleteConfirmation) {
                  handleDelete()
                } else if (googleUser) {
                  signOut({ callbackUrl: '/signup' });
                } else {
                  setConfirmDeleteUser(true);
                }
              }}
            >
              {confirmDeleteUser && !googleUser ? 'Submit' : 'Yes'}
            </button>
            <button
              className="mt-3 mr-3 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none"
              onClick={() => {
                setShowDeleteConfirmation(false)
                setConfirmDeleteUser(false)
                setError('')
                if (error) {
                  router.replace(pathName)
                }
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
