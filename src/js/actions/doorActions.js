const changeRootProps = (key, value) => {
  return {
    type: "CHANGE_ROOT",
    payload: { key: key, value: value }
  }
}
const changeSizesProps = (name, key, value) => {
  return {
    type: "CHANGE_SIZES",
    payload: {
      name: name,
      key: key,
      value: value
    }
  }
}

export default {
  changeRootProps,
  changeSizesProps
}