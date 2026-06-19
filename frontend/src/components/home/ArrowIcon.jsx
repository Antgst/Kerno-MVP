function ArrowIcon({ direction }) {
  return (
    <span aria-hidden="true" className="carousel-arrow">
      {direction === "previous" ? "<" : ">"}
    </span>
  );
}

export default ArrowIcon;
