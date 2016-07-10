export default {
  attached() {
    let observeEditing = (editing) => {
      if (editing) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', '');
      }
    };

    this._unobserveEditing = Simpla.observe('editing', observeEditing);
    observeEditing(Simpla.getState().editing);
  },

  detached() {
    this._unobserveEditing();
  }
}
