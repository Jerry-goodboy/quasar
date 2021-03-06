import { QModal } from '../modal'
import { QIcon } from '../icon'
import { QList, QItem, QItemSide, QItemMain, QItemSeparator } from '../list'

export default {
  name: 'q-action-sheet',
  props: {
    value: Boolean,
    title: String,
    grid: Boolean,
    actions: Array,
    dismissLabel: {
      type: String,
      default: 'Cancel'
    }
  },
  watch: {
    value (val) {
      this[val ? 'show' : 'hide']()
    }
  },
  computed: {
    contentCss () {
      if (this.$q.theme === 'ios') {
        return {backgroundColor: 'transparent'}
      }
    }
  },
  render (h) {
    let
      child = [],
      title = this.$slots.title || this.title

    if (title) {
      child.push(
        h('div', {
          staticClass: 'q-actionsheet-title column justify-center'
        }, [ title ])
      )
    }

    child.push(
      h(
        'div',
        { staticClass: 'q-actionsheet-body scroll' },
        this.actions
          ? [
            this.grid
              ? h('div', { staticClass: 'q-actionsheet-grid row wrap items-center justify-between' }, this.__getActions(h))
              : h(QList, { staticClass: 'no-border', props: { link: true } }, this.__getActions(h))
          ]
          : [ this.$slots.default ]
      )
    )

    if (__THEME__ === 'ios') {
      child = [
        h('div', { staticClass: 'q-actionsheet' }, child),
        h('div', { staticClass: 'q-actionsheet' }, [
          h(QItem, {
            props: {
              link: true
            },
            domProps: {
              tabindex: '0'
            },
            on: {
              click: this.__onCancel,
              keydown: this.__onCancel
            }
          }, [
            h(QItemMain, { staticClass: 'text-center text-primary' }, [
              this.dismissLabel
            ])
          ])
        ])
      ]
    }

    return h(QModal, {
      ref: 'modal',
      props: {
        position: 'bottom',
        contentCss: this.contentCss
      },
      on: {
        show: () => {
          this.$emit('show')
          this.$emit('input', true)
        },
        hide: () => {
          this.$emit('hide')
          this.$emit('input', false)
        },
        dismiss: () => {
          console.log('DIALOG received dismiss, hiding then emitting cancel')
          this.__onCancel()
        },
        'escape-key': () => {
          this.hide().then(() => {
            this.$emit('escape-key')
            this.__onCancel()
          })
        }
      }
    }, child)
  },
  methods: {
    show () {
      console.log('AS show')
      return this.$refs.modal.show()
    },
    hide () {
      console.log('AS hide')
      return this.$refs.modal.hide()
    },
    __getActions (h) {
      return this.actions.map(action => action.label
        ? h(this.grid ? 'div' : QItem, {
          staticClass: this.grid
            ? 'q-actionsheet-grid-item cursor-pointer relative-position column inline flex-center'
            : null,
          'class': action.classes,
          domProps: { tabindex: '0' },
          on: {
            click: () => this.__onOk(action),
            keydown: (e) => this.__onOk(action)
          }
        }, this.grid
          ? [
            action.icon ? h(QIcon, { props: { name: action.icon, color: action.color } }) : null,
            action.avatar ? h('img', { domProps: { src: action.avatar }, staticClass: 'avatar' }) : null,
            h('span', [ action.label ])
          ]
          : [
            h(QItemSide, { props: { icon: action.icon, color: action.color, avatar: action.avatar } }),
            h(QItemMain, { props: { inset: true, label: action.label } })
          ]
        )
        : h(QItemSeparator, { staticClass: 'col-12' })
      )
    },
    __onOk (action) {
      console.log('AS onOK')
      this.hide().then(() => {
        console.log('AS onOK emitting ok')
        this.$emit('ok', action)
      })
    },
    __onCancel () {
      console.log('AS onCancel')
      this.hide().then(() => {
        console.log('AS onCancel emitting cancel')
        this.$emit('cancel')
      })
    }
  }
}
