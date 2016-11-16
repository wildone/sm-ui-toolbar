export default {
  attached() {
    let observeEditing = (editing) => {
      if (editing) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', '');
      }
    };

    this._unobserveEditing = Simpla._v1.observe('editing', observeEditing);
    observeEditing(Simpla._v1.getState().editing);
  },

  detached() {
    this._unobserveEditing();
  }
}
