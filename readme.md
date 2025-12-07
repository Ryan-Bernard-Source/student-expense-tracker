How I Used GitHub Copilot

While building the PieChart component, I used GitHub Copilot to clean up parts of the UI layout and data transformation logic. Some examples include:
- Using short prompts like “React Native view with colored bar based on percentage” to scaffold the bar visualization.
- Having CoPilot clean up some of the messy code in other files to optimize the app.
- Had CoPilot suggest a color pallette for the bar chart, also had it break down the category by percentage if there is multiple items in that category.

Where Co-Pilot Saved Time & Suggestions that I made:

Copilot saved significant time when writing code blocks for each category item. For example, after writing the first block that included the label, amount, percentage bar, and percentage text, Copilot automatically completed:
- Repeated layout structure
- Consistent styling across items
- Indexed color assignment (colors[index % colors.length])
- A suggestion that I changed was that I wanted to avoid adding new dependencies to keep the app lightweight. While also keeping to the original UI without excessive changes.