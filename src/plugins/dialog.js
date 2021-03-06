import { QDialog } from '../components/dialog'
import modalFn from '../utils/modal-fn'

export default {
  __installed: false,
  install ({ Quasar, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    Quasar.dialog = modalFn(QDialog, Vue)
  }
}
