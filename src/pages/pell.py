def pell(k):
    if k==1: return 1
    if k==2: return 2
    if k>2: return (2*pell(k-1)+pell(k-2))

n=int(input())
for i in range(n):
    num=input()
    print(pell(int(num)) % 32767)

int