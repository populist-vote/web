import { useRendering } from "../../helpers/use-rendering";
import { CompositionProps, COMP_NAME } from "../../types/constants";
import { Button } from "./Button/Button";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "./Error";
import { ProgressBar } from "./ProgressBar";

export const RenderControls: React.FC<{
  inputProps: CompositionProps;
}> = ({ inputProps }) => {
  const { renderMedia, state, undo } = useRendering(COMP_NAME, inputProps);

  return (
    <div>
      {state.status === "init" ||
      state.status === "invoking" ||
      state.status === "error" ? (
        <>
          <Button
            disabled={state.status === "invoking"}
            loading={state.status === "invoking"}
            onClick={renderMedia}
          >
            Render video
          </Button>
          {state.status === "error" ? (
            <ErrorComp message={state.error.message} />
          ) : null}
        </>
      ) : null}
      {state.status === "rendering" || state.status === "done" ? (
        <>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          <DownloadButton undo={undo} state={state} />
        </>
      ) : null}
    </div>
  );
};
