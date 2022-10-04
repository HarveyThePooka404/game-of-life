import styles from "../../styles/Cell.module.css";

export default function Cell({
  y,
  x,
  onPress,
}: {
  y: number;
  x: number;
  onPress: any;
}) {
  return (
    <div
      style={{
        width: "49px",
        height: "49px",
        border: "solid 1px black",
      }}
      {...{ "data-x": x }}
      {...{ "data-y": y }}
      {...{ "data-state": "dead" }}
      {...{ "data-next-state": "dead" }}
      onClick={onPress}
      className={styles.essai}
    />
  );
}
