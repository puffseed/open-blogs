<script setup lang="ts">
import { ref, computed } from 'vue';
import Header from '../components/Header.vue';

useHead({
  title: '计算器',
});

// 计算器状态
const display = ref('0');
const currentValue = ref(0);
const previousValue = ref(0);
const operator = ref<string | null>(null);
const waitingForOperand = ref(false);

// 科学计算器状态
const memoryValue = ref(0);
const angleMode = ref<'rad' | 'deg'>('rad');
const is2ndMode = ref(false);

// 数字按钮点击
const handleNumberClick = (number: string) => {
  if (waitingForOperand.value) {
    display.value = number;
    waitingForOperand.value = false;
  } else {
    display.value = display.value === '0' ? number : display.value + number;
  }
};

// 操作符点击
const handleOperatorClick = (op: string) => {
  const value = parseFloat(display.value);

  if (operator.value && waitingForOperand.value) {
    operator.value = op;
    return;
  }

  if (previousValue.value === 0) {
    previousValue.value = value;
  } else if (operator.value) {
    const result = calculate(previousValue.value, value, operator.value);
    display.value = String(result);
    previousValue.value = result;
  }

  waitingForOperand.value = true;
  operator.value = op;
};

// 计算逻辑
const calculate = (a: number, b: number, op: string): number => {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return b === 0 ? 0 : a / b;
    case '^':
      return Math.pow(a, b);
    case 'root':
      return Math.pow(b, 1 / a);
    default:
      return b;
  }
};

// 等号点击
const handleEqualsClick = () => {
  if (!operator.value) return;

  const value = parseFloat(display.value);
  const result = calculate(previousValue.value, value, operator.value);
  display.value = String(result);
  previousValue.value = 0;
  operator.value = null;
  waitingForOperand.value = true;
};

// 清除按钮点击
const handleClearClick = () => {
  display.value = '0';
  currentValue.value = 0;
  previousValue.value = 0;
  operator.value = null;
  waitingForOperand.value = false;
};

// 正负号切换
const handleSignClick = () => {
  display.value = String(parseFloat(display.value) * -1);
};

// 百分比计算
const handlePercentClick = () => {
  display.value = String(parseFloat(display.value) / 100);
  waitingForOperand.value = true;
};

// 小数点点击
const handleDecimalClick = () => {
  if (waitingForOperand.value) {
    display.value = '0.';
    waitingForOperand.value = false;
  } else if (!display.value.includes('.')) {
    display.value += '.';
  }
};

// 括号点击
const handleParenthesesClick = (parentheses: string) => {
  // 简化实现，直接在显示中添加括号
  if (waitingForOperand.value) {
    display.value = parentheses;
    waitingForOperand.value = false;
  } else {
    display.value += parentheses;
  }
};

// 内存操作
const handleMemoryClick = (action: string) => {
  const value = parseFloat(display.value);
  switch (action) {
    case 'mc':
      memoryValue.value = 0;
      break;
    case 'm+':
      memoryValue.value += value;
      break;
    case 'm-':
      memoryValue.value -= value;
      break;
    case 'mr':
      display.value = String(memoryValue.value);
      waitingForOperand.value = true;
      break;
  }
};

// 2nd功能切换
const handle2ndClick = () => {
  is2ndMode.value = !is2ndMode.value;
};

// 角度模式切换
const handleAngleModeClick = () => {
  angleMode.value = angleMode.value === 'rad' ? 'deg' : 'rad';
};

// 科学函数计算
const handleScientificClick = (func: string) => {
  const value = parseFloat(display.value);
  let result = 0;
  
  switch (func) {
    case 'x2':
      result = value * value;
      break;
    case 'x3':
      result = value * value * value;
      break;
    case 'xy':
      // 简化实现，这里需要等待第二个操作数
      waitingForOperand.value = true;
      operator.value = '^';
      previousValue.value = value;
      return;
    case 'ex':
      result = Math.exp(value);
      break;
    case '10x':
      result = Math.pow(10, value);
      break;
    case '1/x':
      result = value !== 0 ? 1 / value : 0;
      break;
    case 'sqrt':
      result = Math.sqrt(value);
      break;
    case 'cbrt':
      result = Math.cbrt(value);
      break;
    case 'yroot':
      // 简化实现，这里需要等待第二个操作数
      waitingForOperand.value = true;
      operator.value = 'root';
      previousValue.value = value;
      return;
    case 'ln':
      result = Math.log(value);
      break;
    case 'log10':
      result = Math.log10(value);
      break;
    case 'factorial':
      result = factorial(value);
      break;
    case 'sin':
      result = angleMode.value === 'rad' ? Math.sin(value) : Math.sin(value * Math.PI / 180);
      break;
    case 'cos':
      result = angleMode.value === 'rad' ? Math.cos(value) : Math.cos(value * Math.PI / 180);
      break;
    case 'tan':
      result = angleMode.value === 'rad' ? Math.tan(value) : Math.tan(value * Math.PI / 180);
      break;
    case 'e':
      result = Math.E;
      break;
    case 'EE':
      // 科学计数法
      display.value += 'e';
      return;
    case 'sinh':
      result = Math.sinh(value);
      break;
    case 'cosh':
      result = Math.cosh(value);
      break;
    case 'tanh':
      result = Math.tanh(value);
      break;
    case 'pi':
      result = Math.PI;
      break;
    case 'rand':
      result = Math.random();
      break;
  }
  
  display.value = String(result);
  waitingForOperand.value = true;
};

// 阶乘函数
const factorial = (n: number): number => {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};
</script>

<template>
  <div class="calculator-page">
    <Header title="计算器" />
    <div class="calculator">
      <div class="calculator-display">
        <div class="display-value">{{ display }}</div>
      </div>
      <div class="calculator-keypad">
        <!-- 第一行：括号、内存操作、清除、正负号、百分比、除号 -->
        <div class="keypad-row">
          <button class="key key-function" @click="handleParenthesesClick('(')">(</button>
          <button class="key key-function" @click="handleParenthesesClick(')')">)</button>
          <button class="key key-function" @click="handleMemoryClick('mc')">mc</button>
          <button class="key key-function" @click="handleMemoryClick('m+')">m+</button>
          <button class="key key-function" @click="handleMemoryClick('m-')">m-</button>
          <button class="key key-function" @click="handleMemoryClick('mr')">mr</button>
          <button class="key key-clear" @click="handleClearClick">AC</button>
          <button class="key key-function" @click="handleSignClick">+/-</button>
          <button class="key key-function" @click="handlePercentClick">%</button>
          <button class="key key-operator" @click="handleOperatorClick('÷')">÷</button>
        </div>
        
        <!-- 第二行：2nd、平方、立方、幂、指数、10的幂、数字7-9、乘号 -->
        <div class="keypad-row">
          <button class="key key-function" @click="handle2ndClick">2nd</button>
          <button class="key key-function" @click="handleScientificClick('x2')">x²</button>
          <button class="key key-function" @click="handleScientificClick('x3')">x³</button>
          <button class="key key-function" @click="handleScientificClick('xy')">xʸ</button>
          <button class="key key-function" @click="handleScientificClick('ex')">eˣ</button>
          <button class="key key-function" @click="handleScientificClick('10x')">10ˣ</button>
          <div class="number-pad">
            <button class="key key-number" @click="handleNumberClick('7')">7</button>
            <button class="key key-number" @click="handleNumberClick('8')">8</button>
            <button class="key key-number" @click="handleNumberClick('9')">9</button>
          </div>
          <button class="key key-operator" @click="handleOperatorClick('×')">×</button>
        </div>
        
        <!-- 第三行：倒数、平方根、立方根、y次方根、自然对数、常用对数、数字4-6、减号 -->
        <div class="keypad-row">
          <button class="key key-function" @click="handleScientificClick('1/x')">1/x</button>
          <button class="key key-function" @click="handleScientificClick('sqrt')">√x</button>
          <button class="key key-function" @click="handleScientificClick('cbrt')">∛x</button>
          <button class="key key-function" @click="handleScientificClick('yroot')">ʸ√x</button>
          <button class="key key-function" @click="handleScientificClick('ln')">ln</button>
          <button class="key key-function" @click="handleScientificClick('log10')">log₁₀</button>
          <div class="number-pad">
            <button class="key key-number" @click="handleNumberClick('4')">4</button>
            <button class="key key-number" @click="handleNumberClick('5')">5</button>
            <button class="key key-number" @click="handleNumberClick('6')">6</button>
          </div>
          <button class="key key-operator" @click="handleOperatorClick('-')">-</button>
        </div>
        
        <!-- 第四行：阶乘、正弦、余弦、正切、e、EE、数字1-3、加号 -->
        <div class="keypad-row">
          <button class="key key-function" @click="handleScientificClick('factorial')">x!</button>
          <button class="key key-function" @click="handleScientificClick('sin')">sin</button>
          <button class="key key-function" @click="handleScientificClick('cos')">cos</button>
          <button class="key key-function" @click="handleScientificClick('tan')">tan</button>
          <button class="key key-function" @click="handleScientificClick('e')">e</button>
          <button class="key key-function" @click="handleScientificClick('EE')">EE</button>
          <div class="number-pad">
            <button class="key key-number" @click="handleNumberClick('1')">1</button>
            <button class="key key-number" @click="handleNumberClick('2')">2</button>
            <button class="key key-number" @click="handleNumberClick('3')">3</button>
          </div>
          <button class="key key-operator" @click="handleOperatorClick('+')">+</button>
        </div>
        
        <!-- 第五行：角度模式、双曲正弦、双曲余弦、双曲正切、π、随机数、数字0、小数点、等号 -->
        <div class="keypad-row">
          <button class="key key-function" @click="handleAngleModeClick">Rad</button>
          <button class="key key-function" @click="handleScientificClick('sinh')">sinh</button>
          <button class="key key-function" @click="handleScientificClick('cosh')">cosh</button>
          <button class="key key-function" @click="handleScientificClick('tanh')">tanh</button>
          <button class="key key-function" @click="handleScientificClick('pi')">π</button>
          <button class="key key-function" @click="handleScientificClick('rand')">Rand</button>
          <div class="number-pad">
            <button class="key key-number key-zero" @click="handleNumberClick('0')">0</button>
            <button class="key key-number" @click="handleDecimalClick">.</button>
          </div>
          <button class="key key-equals" @click="handleEqualsClick">=</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.calculator-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.calculator {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: #222;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  .calculator-display {
    background-color: #111;
    color: white;
    padding: 24px;
    text-align: right;
    font-size: 3rem;
    font-weight: 300;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .calculator-keypad {
    display: flex;
    flex-direction: column;
    background-color: #333;
    gap: 2px;

    .keypad-row {
      display: flex;
      height: 70px;

      .key {
        flex: 1;
        border: none;
        color: white;
        height: 100%;
        margin: 2px;
        font-size: 1.2rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          opacity: 0.9;
        }

        &:active {
          opacity: 0.8;
        }

        &.key-number {
          background-color: #444;

          &:hover {
            background-color: #555;
          }

          &:active {
            background-color: #666;
          }
        }

        &.key-function {
          background-color: #555;

          &:hover {
            background-color: #666;
          }

          &:active {
            background-color: #777;
          }
        }

        &.key-clear {
          background-color: #555;

          &:hover {
            background-color: #666;
          }

          &:active {
            background-color: #777;
          }
        }

        &.key-operator,
        &.key-equals {
          background-color: #ff9500;

          &:hover {
            background-color: #ffaa1a;
          }

          &:active {
            background-color: #cc7a00;
          }
        }

        &.key-zero {
          flex: 2;
        }
      }
      
      .number-pad {
        display: flex;
        flex: 3;
        
        .key {
          flex: 1;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 480px) {
  .calculator {
    max-width: 100%;
    height: 100vh;
    border-radius: 0;

    .calculator-display {
      padding: 40px 24px;
      font-size: 4rem;
    }

    .keypad-row {
      height: 80px;

      .key {
        font-size: 1.4rem;
      }
    }
  }
}
</style>
