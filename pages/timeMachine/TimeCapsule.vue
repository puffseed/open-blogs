<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 人生三万天计算结果类型
interface LifeResultSuccess {
  passedDays: number
  remainingDays: number
  remainingYears: number
  percentage: number
  comment: string
}
interface LifeResultError {
  error: string
}

// 响应式数据
const currentTime = ref(new Date())
const ageInput = ref('')
const lifeResult = ref<LifeResultSuccess | LifeResultError | null>(null)

// 计算今日度过的小时数
const todayHours = computed(() => {
  const now = currentTime.value
  return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600
})

// 计算今日度过的百分比
const todayPercentage = computed(() => {
  return Math.min(100, Math.round((todayHours.value / 24) * 100))
})

// 计算本周度过的天数
const weekDays = computed(() => {
  const now = currentTime.value
  // 周日是0，周一到周六是1-6
  const dayOfWeek = now.getDay() || 7
  return dayOfWeek
})

// 计算本周度过的百分比
const weekPercentage = computed(() => {
  return Math.min(100, Math.round((weekDays.value / 7) * 100))
})

// 计算本月度过的天数
const monthDays = computed(() => {
  return currentTime.value.getDate()
})

// 计算本月总天数
const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  return new Date(year, month + 1, 0).getDate()
}

// 计算本月度过的百分比
const monthPercentage = computed(() => {
  const daysInMonth = getDaysInMonth(currentTime.value)
  return Math.min(100, Math.round((monthDays.value / daysInMonth) * 100))
})

// 计算今年度过的月数
const yearMonths = computed(() => {
  return currentTime.value.getMonth() + 1
})

// 计算今年度过的百分比
const yearPercentage = computed(() => {
  return Math.min(100, Math.round((yearMonths.value / 12) * 100))
})

// 人生三万天计算
const calculateLife = () => {
  const ageNum = Number(ageInput.value)
  if (!ageInput.value || isNaN(ageNum) || ageNum <= 0) {
    lifeResult.value = { error: '请输入有效的年龄哦~' } as LifeResultError
    return
  }
  
  const age = ageNum
  const totalDays = 30000
  const passedDays = Math.floor(age * 365.25)
  const remainingDays = Math.max(0, totalDays - passedDays)
  const remainingYears = remainingDays / 365.25
  
  // 幽默的语言
  const humorousComments = [
    `哇塞！您还能活 ${Math.floor(remainingYears)} 年，约 ${remainingDays} 天！继续嗨皮吧~`,
    `恭喜！您的人生进度条才走了 ${Math.round(passedDays / totalDays * 100)}%，还有大把时光可以挥霍~`,
    `别急着躺平，您还有 ${Math.floor(remainingYears)} 年可以搞事情！`,
    `人生三万天，您已经用了 ${passedDays} 天，剩下的 ${remainingDays} 天要好好享受哦~`,
    `看来您的保质期还很长，继续发光发热吧！`
  ]
  
  const randomComment = humorousComments[Math.floor(Math.random() * humorousComments.length)]
  
  lifeResult.value = {
    passedDays,
    remainingDays,
    remainingYears: Math.floor(remainingYears),
    percentage: Math.round(passedDays / totalDays * 100),
    comment: randomComment
  } as LifeResultSuccess
}

// 成功结果（用于模板类型收窄）
const lifeResultSuccess = computed(() => {
  const r = lifeResult.value
  return r && !('error' in r) ? r : null
})

// 实时更新时间
let updateTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  updateTimer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
  }
})
</script>

<!-- 时光胶囊 -->
<template>
  <div class="time-capsule">
    <div class="container">
      <!-- 时间统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⏰</div>
          <h2 class="stat-value">{{ todayHours.toFixed(2) }}</h2>
          <p class="stat-label">今日已度过(小时)</p>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: todayPercentage + '%' }"></div>
              <span class="progress-text">{{ todayPercentage }}%</span>
            </div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <h2 class="stat-value">{{ weekDays }}</h2>
          <p class="stat-label">本周已度过(天)</p>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: weekPercentage + '%' }"></div>
              <span class="progress-text">{{ weekPercentage }}%</span>
            </div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🗓️</div>
          <h2 class="stat-value">{{ monthDays }}</h2>
          <p class="stat-label">本月已度过(天)</p>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: monthPercentage + '%' }"></div>
              <span class="progress-text">{{ monthPercentage }}%</span>
            </div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📆</div>
          <h2 class="stat-value">{{ yearMonths }}</h2>
          <p class="stat-label">今年已度过(月)</p>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: yearPercentage + '%' }"></div>
              <span class="progress-text">{{ yearPercentage }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 人生三万天计算器 -->
      <div class="life-calculator">
        <h2 class="section-title">人生三万天</h2>
        <div class="input-group">
          <input 
            type="number" 
            v-model="ageInput" 
            placeholder="请输入您的年龄" 
            class="age-input"
            min="0"
            max="120"
          >
          <button @click="calculateLife" class="calculate-btn">计算人生</button>
        </div>
        
        <!-- 计算结果 -->
        <div v-if="lifeResult" class="life-result">
          <div v-if="'error' in lifeResult" class="error-message">
            {{ lifeResult.error }}
          </div>
          <div v-else-if="lifeResultSuccess" class="result-content">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: lifeResultSuccess.percentage + '%' }"></div>
              <span class="progress-text">{{ lifeResultSuccess.percentage }}%</span>
            </div>
            <p class="result-comment">{{ lifeResultSuccess.comment }}</p>
            <div class="result-stats">
              <div class="result-item">
                <span class="result-label">已度过:</span>
                <span class="result-value">{{ lifeResultSuccess.passedDays }}</span>
                <span class="result-unit">天</span>
              </div>
              <div class="result-item">
                <span class="result-label">剩余:</span>
                <span class="result-value">{{ lifeResultSuccess.remainingDays }}</span>
                <span class="result-unit">天</span>
                /
                <span class="result-value">{{ lifeResultSuccess.remainingYears }}</span>
                <span class="result-unit">年</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.time-capsule {
  padding: 2rem 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .stat-card {
      background: rgba(255, 255, 255, 0.8);
      border-radius: var(--size-16);
      padding: 2rem;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      }
      
      .stat-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      
      .stat-value {
        font-size: 3rem;
        font-weight: bold;
        color: #0066cc;
        margin-bottom: 0.5rem;
      }
      
      .stat-label {
        font-size: 1.1rem;
        color: #666;
        margin: 0 0 1.5rem 0;
      }
      
      .progress-bar-container {
        margin-top: 1rem;
      }
      
      .progress-bar {
        width: 100%;
        height: var(--size-20);
        background: rgba(255, 255, 255, 0.6);
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #b3d8ff, #0066cc);
        border-radius: 10px;
        transition: width 0.5s ease;
      }
      
      .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: var(--fs-12);
        font-weight: bold;
        color: #333;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
      }
    }
  
  .life-calculator {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .section-title {
    text-align: center;
    font-size: var(--fs-20);
    font-weight: bold;
    color: #333;
    margin-bottom: 2rem;
  }
  
  .input-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
    
    .age-input {
      padding: 0.8rem 1.2rem;
      border: 2px solid #b3d8ff;
      border-radius: var(--size-8);
      font-size: 1.1rem;
      width: 200px;
      transition: border-color 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #0066cc;
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
      }
    }
    
    .calculate-btn {
      padding: 0.8rem 2rem;
      background: linear-gradient(135deg, #b3d8ff, #0066cc);
      color: white;
      border: none;
      border-radius: var(--size-8);
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
  
  .life-result {
    margin-top: 2rem;
  }
  
  .error-message {
    text-align: center;
    color: #ff4444;
    font-size: 1.1rem;
    padding: 1rem;
    background: rgba(255, 68, 68, 0.1);
    border-radius: 8px;
  }
  
  .result-content {
    .progress-bar {
      width: 100%;
      height: 20px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 1.5rem;
      position: relative;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #b3d8ff, #0066cc);
        border-radius: 10px;
        transition: width 0.5s ease;
      }
      
      .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.9rem;
        font-weight: bold;
        color: #333;
      }
    }
    
    .result-comment {
      text-align: center;
      font-size: 1.2rem;
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .result-stats {
      display: flex;
      justify-content: center;
      gap: 3rem;
      flex-wrap: wrap;
      
      .result-item {
        text-align: center;
        
        .result-label {
          font-size: 1rem;
          color: #666;
          margin-bottom: 0.3rem;
        }
        
        .result-value {
          font-size: 1.8rem;
          font-weight: bold;
          color: #333;
        }
        
        .result-unit {
          font-size: 1rem;
          color: #666;
        }
      }
    }
  }
  
  // 响应式设计
  @media (max-width: 768px) {
    padding: 1rem 0;
    
    .title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      padding: 1.5rem;
      
      .stat-icon {
        font-size: 2.5rem;
      }
      
      .stat-value {
        font-size: 2.5rem;
      }
      
      .stat-label {
        font-size: 1rem;
        margin-bottom: 1rem;
      }
      
      .progress-bar {
        height: var(--size-16);
      }
      
      .progress-text {
        font-size: 0.8rem;
      }
    }
    
    .life-calculator {
      padding: 1.5rem;
    }
    
    .input-group {
      flex-direction: column;
      align-items: center;
      
      .age-input {
        width: 100%;
        max-width: 300px;
      }
      
      .calculate-btn {
        width: 100%;
        max-width: 300px;
      }
    }
    
    .result-stats {
      gap: 2rem;
      
      .result-item {
        .result-value {
          font-size: 1.5rem;
        }
      }
    }
  }
  
  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>
