import { FontIcon, initializeIcons, Stack } from "@fluentui/react";
import { SurveyFreeText } from "./components/surveys/survey-free-text";
import data from "./data/survey_results.json";

initializeIcons();

function App() {
  const happinessScore = 47;

  // const aggregate = data.questions.reduce((acc, question) => {
  //   if (question.type === 'text') return acc;
  //   return { 
  //     sum: acc.sum + (question.responses as number[])?.reduce(
  //       (accQuestion, response) => { return accQuestion + response}, 0
  //       ),
  //     count: acc.count + 1 }
  // }, {sum: 0, count: 0});

  // gives 138.8?
  // const happinessScore = aggregate.sum / aggregate.count;

  const date = new Date(data.created_at);
  const dateString = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}.`;

  return (
    <Stack style={{ margin: 20 }}>
      <h1>
        <FontIcon iconName="ClipboardList" style={{ marginRight: "5px" }} />
        {data.survey_title}
      </h1>

      <p>
        This survey was started on {dateString} Overall, 45 people participated
        in the survey.
      </p>

      <h1 data-testid="happinessScore">
        <FontIcon iconName="ChatBot" style={{ marginRight: "5px" }} />
        {happinessScore} / 100
      </h1>
      <Stack>
        <SurveyFreeText />
      </Stack>
    </Stack>
  );
}

export default App;
