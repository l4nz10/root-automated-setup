import classNames from "classnames";
import { useTranslation } from "react-i18next";
import {
  selectFlowState,
  selectSetupParameters,
  setCurrentFactionIndex,
  setErrorMessage,
} from "../../features";
import { useAppDispatch, useAppSelector } from "../hooks";
import styles from "./factionSelect.module.css";
import defaultImage from "../../images/componentDefault.png";
import { useContext } from "react";
import { StepContext } from "../step";

export const FactionSelect: React.FC = () => {
  const { factionPool, currentFactionIndex, lastFactionLocked } =
    useAppSelector(selectFlowState);
  const { errorMessage } = useAppSelector(selectSetupParameters);
  const dispatch = useAppDispatch();
  const { stepActive } = useContext(StepContext);
  const { t } = useTranslation();

  return (
    <div
      className={styles.carousel}
      role="radiogroup"
      aria-label={t("setupStep.selectFaction.subtitle")}
      aria-required="true"
      aria-invalid={stepActive && errorMessage ? true : undefined}
      aria-errormessage={stepActive && errorMessage ? "appError" : undefined}
      aria-disabled={!stepActive}
    >
      {factionPool.map((faction, index) => {
        // Prepare the faction name in advance as we need to incorporate the vagabond character name (if there is one)
        const factionName = `${t(`faction.${faction.key}.name`)}${
          faction.vagabond
            ? ` (${t(`vagabond.${faction.vagabond.code}.name`)})`
            : ""
        }`;
        return (
          <button
            key={faction.code}
            className={classNames(styles.faction, {
              [styles.selected]: index === currentFactionIndex,
              [styles.locked]:
                lastFactionLocked && index === factionPool.length - 1,
            })}
            onClick={() => {
              if (index !== currentFactionIndex) {
                if (!lastFactionLocked || index < factionPool.length - 1) {
                  dispatch(setCurrentFactionIndex(index));
                } else {
                  dispatch(setErrorMessage("error.lockedFaction"));
                }
              }
            }}
            disabled={!stepActive}
            role="radio"
            aria-checked={index === currentFactionIndex}
            aria-disabled={
              stepActive
                ? lastFactionLocked && index === factionPool.length - 1
                : undefined
            }
            aria-label={stepActive ? factionName : undefined}
          >
            <img
              className={styles.image}
              src={
                faction.image
                  ? `${process.env.PUBLIC_URL}/images/${faction.image}`
                  : defaultImage
              }
              alt="" // We're including the alt text in the button itself so don't bother reading out the image
              aria-hidden="true"
            />
            <div>{factionName}</div>
          </button>
        );
      })}
    </div>
  );
};
