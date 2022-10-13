function StyleButton(props: { [key: string]: any }) {
  let className = "RichEditor-styleButton";
  if (props.active) {
    className += " RichEditor-activeButton";
  }

  const onToggle = (e: any) => {
    e.preventDefault();
    props.onToggle(props.style);
  };

  return (
    <span className={className} onMouseDown={onToggle}>
      {props.label}
    </span>
  );
}
export default StyleButton;
