import { CheckboxVisibility, DetailsList, IGroup, Stack } from "@fluentui/react";
import { FunctionComponent } from "react";
import data from "../../data/survey_results.json";
import { IQuestion, IAverageItem, IItem } from "../../types/surveys";

const getAvg = (nums: Array<number>) => {
  const total = nums.reduce((acc: number, c: number) => acc + c, 0);
  return (total / nums.length).toFixed(2);
};

const getGroupsData = (questions: IQuestion[]) => {
  let startIndex = 0;
  const groupAverages: IAverageItem[] = [];

  const groups = questions?.map((question, index) => {
    const count = question.responses?.length;
    const group: IGroup = { 
      key: question.question_text + index, 
      name: `${question.question_text} ${question.type === 'number' ? '(AVG)' : ''}`, 
      startIndex, 
      count: question.type === 'number' ? 1 : count, // could be count if we want all answers but then we shouldn't print avg
      isCollapsed: true
    };
    
    if (question.type === 'number') {
      groupAverages.push({ index: startIndex, value: getAvg(question.responses as number[]) });
    }
    startIndex += count;
    return group;
  })

  return { groups, groupAverages }
}

export const SurveyFreeText: FunctionComponent = () => {

  const questions: IQuestion[] = data.questions;

  const items: IItem[] = questions?.reduce((items, question) => {
    const new_items = question.responses?.map((response, index) => { return { key: index, value: response, type: question.type}; }) as IItem[];
    return [...items, ...new_items];
  }, [] as IItem[])

  const { groups, groupAverages } = getGroupsData(questions);

  const _onRenderColumn = (item?: IItem, index?: number) => {
    let value = item?.value;

    // comment this if you don't want to print avg, but also change count and name in getGroupsData
    if (!index || item?.type === 'number') {
      for (const avgGroup of groupAverages) {
        if (avgGroup.index === index) {
          value = avgGroup.value;
          break;
        }
      }
      if (value === item?.value) return null;
    }

    return (
      <div data-is-focusable={true} key={item?.key}>
        <h2>
          {value}
        </h2>
      </div>
    );
  };

  return (
    <Stack data-testid="FreeTextTable">
      <DetailsList
        checkboxVisibility={CheckboxVisibility.hidden}
        items={items}
        groups={groups}
        columns={[{ key: "Free text", name: "Text Answers", minWidth: 200, isCollapsible: true }]}
        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
        ariaLabelForSelectionColumn="Toggle selection"
        checkButtonAriaLabel="select row"
        checkButtonGroupAriaLabel="select section"
        groupProps={{
            isAllGroupsCollapsed: true,
            showEmptyGroups: true,
          }}
        onRenderItemColumn={_onRenderColumn}
        compact={true}
      />
    </Stack>
  );
};
