package com.mukho.pro.member.service

import com.mukho.pro.common.authority.JwtTokenProvider
import com.mukho.pro.common.authority.TokenInfo
import com.mukho.pro.common.exception.InvalidInputException
import com.mukho.pro.common.status.ROLE
import com.mukho.pro.member.dto.LoginDto
import com.mukho.pro.member.dto.MemberDtoResponse
import com.mukho.pro.member.dto.MemberDtoRequest
import com.mukho.pro.member.entity.MemberRole
import com.mukho.pro.member.repository.MemberRepository
import com.mukho.pro.member.repository.MemberRoleRepository
import jakarta.transaction.Transactional
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.stereotype.Service

@Transactional
@Service
class MemberService(
    private val memberRepository: MemberRepository,
    private val memberRoleRepository: MemberRoleRepository,
    private val authenticationManagerBuilder: AuthenticationManagerBuilder,
    private val jwtTokenProvider: JwtTokenProvider,
) {
    fun signUp(memberDtoRequest: MemberDtoRequest): String {
        var member = memberRepository
            .findByLoginId(memberDtoRequest.loginId)
        if (member != null) {
            throw InvalidInputException("loginId", "이미 등록된 ID 입니다.")
        }

        member = memberDtoRequest.toEntity()
        memberRepository.save(member)

        val customRole = if (member.name == "묵호") ROLE.ADMIN else ROLE.USER
        val memberRole = MemberRole(null, customRole, member)
        memberRoleRepository.save(memberRole)

        return "회원가입이 완료 되었습니다."
    }

    fun login(loginDto: LoginDto): TokenInfo {
        val authenticationToken =
            UsernamePasswordAuthenticationToken(loginDto.loginId, loginDto.password)
        val authentication =
            authenticationManagerBuilder.`object`.authenticate(authenticationToken)

        return jwtTokenProvider.createToken(authentication)
    }

    fun searchMyInfo(id: Long): MemberDtoResponse {
        val member = memberRepository.findByIdOrNull(id)
            ?: throw InvalidInputException("id", "회원번호(${id})가 존재하지 않습니다.")
        return member.toDto()
    }

    fun saveMyInfo(memberDtoRequest: MemberDtoRequest): String {
        val member = memberDtoRequest.toEntity()
        memberRepository.save(member)
        return "회원 정보가 수정되었습니다."
    }
}