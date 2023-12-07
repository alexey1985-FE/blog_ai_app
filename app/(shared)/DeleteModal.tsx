import { Dispatch, SetStateAction } from "react"

interface Delete {
  handleDelete: () => Promise<void> | ((arg: string) => Promise<void>)
  deleteMessage: string
  setShowDeleteConfirmation: Dispatch<SetStateAction<boolean>>
}

const DeleteModal = ({ handleDelete, deleteMessage, setShowDeleteConfirmation }: Delete) => {

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white p-8 rounded shadow-lg animate-fade-in">
        <p className="text-xl mb-4 text-center">{deleteMessage}</p>
        <div className="flex justify-center">
          <button
            className="mt-3 mr-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
            onClick={() => handleDelete()}
          >
            Yes
          </button>
          <button
            className="mt-3 mr-3 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
