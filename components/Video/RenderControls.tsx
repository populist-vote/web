import { useRendering } from "../../helpers/use-rendering";
import { CompositionProps, COMP_NAME } from "../../types/constants";
import { DownloadButton } from "./DownloadButton/DownloadButton";
import { ErrorComp } from "./Error";
import { ProgressBar } from "./ProgressBar";

export const RenderControls: React.FC<{
  inputProps: CompositionProps;
}> = ({ inputProps }) => {
  const { renderMedia, state, undo } = useRendering(COMP_NAME, inputProps);

  return (
    <div>
      {(state.status === "init" ||
        state.status === "invoking" ||
        state.status === "error") && (
        <>
          <DownloadButton
            disabled={state.status === "invoking"}
            loading={state.status === "invoking"}
            onClick={renderMedia}
          >
            Download Video
          </DownloadButton>
          {state.status === "error" && (
            <ErrorComp message={state.error.message} />
          )}
        </>
      )}
      {(state.status === "rendering" || state.status === "done") && (
        <>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <DownloadButton secondary onClick={undo}>
              <UndoIcon />
            </DownloadButton>
            <DownloadButton
              href={state.status === "done" ? state.url : undefined}
              state={state}
              disabled={state.status === "rendering"}
              loading={state.status === "rendering"}
            >
              Download Video
            </DownloadButton>
          </div>
        </>
      )}
    </div>
  );
};

const UndoIcon: React.FC = () => {
  return (
    <svg height="1em" viewBox="0 0 512 512">
      <path
        fill="#fff"
        d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z"
      />
    </svg>
  );
};
